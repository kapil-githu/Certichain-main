"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CloseOutlined } from "@mui/icons-material";
import { FaGear } from "react-icons/fa6";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import db from "@/config/firebase";

const CreateInstitutes = () => {
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    description: "",
    website_url: "",
    institute_type: "",
    course_name: "",
    courses: [],
  });

  const [institutes, setInstitutes] = useState([]);
  const [courses, setCourses] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!window.ethereum) {
      toast.error("Please install metamask to continue");
    }
    if (sessionStorage.getItem("address") !== "hello@lnmiit.ac.in") {
      window.location.href = "/";
    }
  }, []);

  // const getAllInstitutes = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   console.log(signer);
  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     InstitutesABI,
  //     signer
  //   );

  //   contract
  //     .getAllInstitutes()
  //     .then((institutes) => {
  //       let arr = [];

  //       institutes.forEach((institute) => {
  //         arr.push({
  //           id: institute.id._hex,
  //           walletAddress: institute.walletAddress,
  //           name: institute.name,
  //           description: institute.description,
  //           coursesCount: institute.coursesCount,
  //         });
  //       });

  //       setInstitutes(arr);
  //       console.log(arr);
  //       setLoading(false);
  //     })
  //     .catch(async (err) => {
  //       await loginToMetaMask()
  //         .then((accounts) => {
  //           if (accounts.length > 0) {
  //             getAllInstitutes();
  //           }
  //         })
  //         .catch((errorr) => {
  //           toast.error("Please login to Metamask");
  //           loginToMetaMask();
  //         });
  //       console.log(err);
  //       setLoading(false);
  //     });
  // };

  const loginToMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const colRef = collection(db, "institutes");

        // MetaMask login
        await loginToMetaMask()
          .then((accounts) => {
            if (accounts.length > 0) {
              // Fetch data from Firebase
              const q = query(colRef, orderBy("name", "asc"));
              onSnapshot(q, (snapshot) => {
                let arr = [];
                snapshot.forEach((doc) => {
                  arr.push(doc.data());
                });
                setInstitutes(arr);
                setLoading(false);
              });
            }
          })
          .catch(() => {
            toast.error("Please login to Metamask");
          });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [db]);

  // NEW
  const handleSubmit = async () => {
    setCreateLoading(true);
    try {
      const colRef = collection(db, "institutes");
      const docRef = doc(db, "institutes", formData.address.toLowerCase());
      setDoc(docRef, {
        walletAddress: formData.address.toLowerCase(),
        name: formData.name,
        description: formData.description,
        website_url: formData.website_url,
        courses: formData.courses,
        pin: "1234",
        institute_type: formData.institute_type
      }).then(() => {
        toast.success("Institute Created Successfully");
        setCreateLoading(false);
        document.getElementById("cancel_add_institute_dialog").click();
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // NEW
  const getAllCourses = async (walletAddress) => {
    const docRef = doc(db, "institutes", walletAddress);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        setCourses(doc.data().courses);
      } else {
        console.log("No such document!");
      }
    });
  };
  return (
    <section className="h-screen">
      {/* Navbar */}
      <div className="navbar flex bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Certichain</a>
        </div>
        <div className="hidden lg:flex">
          <div className="space-x-4">
            <button
              className="btn btn-success"
              onClick={() =>
                document.getElementById("add_institute_modal").showModal()
              }
            >
              Add Institute
            </button>
            <button
              className="btn btn-outline btn-ghost"
              onClick={() =>
                document.getElementById("logout_modal").showModal()
              }
            >
              Logout
            </button>
          </div>
        </div>
        {/* NAVBAR MOBILE */}
        <div className="flex-none lg:hidden mr-4">
          <ul className="menu menu-horizontal px-4 min-w-max">
            <li>
              <details>
                <summary>
                  <FaGear />
                </summary>
                <ul className="p-1 z-10 text-sm bg-base-100 rounded-t-none">
                  <li>
                    <button
                      onClick={() =>
                        document
                          .getElementById("add_institute_modal")
                          .showModal()
                      }
                    >
                      Add Institute
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        document.getElementById("logout_modal").showModal()
                      }
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="w-full">
        <div className="flex mt-10 items-center justify-center">
          <div className="overflow-x-auto">
            <h3 className="text-md sm:text-xl dark:text-white text-gray-900 capitalize p-3 flex items-center">
              All Institutes{" "}
              <div className="badge-primary p-2 ml-3 rounded-lg w-fit">
                {institutes.length}
              </div>
            </h3>
            <table className="table overflow-auto!">
              <thead>
                <tr className="text-center text-md md:text-lg">
                  <th>Sr. No.</th>
                  <th>Institute Wallet Address</th>
                  <th>Institute Name</th>
                  <th>Institute Type</th>
                  <th>Description</th>
                  <th>Website URL</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    {/* Loading */}
                    <td
                      role="status"
                      className=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
                      colSpan={7}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <span className="sr-only">Loading...</span>
                    </td>
                  </tr>
                ) : institutes.length > 0 ? (
                  institutes.map((institute, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{institute.walletAddress}</td>
                      <td>{institute.name}</td>
                      <td>{institute.institute_type}</td>
                      <td className="max-w-[100px] md:max-w-[300px] overflow-clip text-ellipsis">
                        {institute.description}
                      </td>
                      <td className="max-w-[100px] md:max-w-[300px] overflow-clip text-ellipsis">
                        {institute.website_url !== undefined
                          ? institute.website_url
                          : "N/A"}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-accent"
                          onClick={() => {
                            getAllCourses(institute.walletAddress);
                            document
                              .getElementById("view_courses_modal")
                              .showModal();
                          }}
                        >
                          View Courses
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={5}>
                      No Institutes Created
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Logout Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Logout Confirmation</h3>
          <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">No</button>
            </form>
            <button
              className="ml-5 btn-error btn"
              onClick={() => {
                sessionStorage.removeItem("address");
                window.location.href = "/";
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>

      {/* Add Institute Modal */}
      <dialog id="add_institute_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Institute</h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Wallet Address <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Wallet Address"
              autoFocus
              onChange={(e) => handleChange(e)}
              name="address"
              required
              className="input input-bordered input-primary w-full max-w-2xl"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Institute Name <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Institute Name"
              onChange={(e) => handleChange(e)}
              name="name"
              required
              className="input input-bordered input-primary w-full max-w-2xl"
            />
          </div>
          <div className="form-control">
            <label htmlFor="institute_type" className="label">
              <span className="label-text">
                Institute Type
                <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              id="institute_type"
              onChange={(e) => handleChange(e)}
              name="institute_type"
              required
              className="select w-full border border-primary max-w-full"
            >
              <option disabled selected>
                Select a type
              </option>
              <option>Educational Institute</option>
              <option>Corporate Institute</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Description <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Description"
              onChange={(e) => handleChange(e)}
              name="description"
              required
              className="input input-bordered input-primary w-full max-w-2xl"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Website URL</span>
            </label>
            <input
              type="url"
              placeholder="Enter Website URL"
              onChange={(e) => handleChange(e)}
              name="website_url"
              required
              className="input input-bordered input-primary w-full max-w-2xl"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Add Institute Courses</span>
              <p className="label-text-alt text-xs text-gray-400">(Optional)</p>
            </label>
            {/* More info about Courses */}
            <p className="text-xs text-gray-400 mb-1">
              Courses allow you to create certificates for different courses in
              your institute.
            </p>
            <input
              type="text"
              placeholder="Enter Course Name"
              name="course_name"
              onChange={(e) => handleChange(e)}
              required
              id="course_name"
              className="input input-bordered input-primary w-full max-w-2xl"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setFormData((prevData) => ({
                  ...prevData,
                  courses: [...prevData.courses, formData.course_name],
                }));
                document.getElementById("course_name").value = "";
                console.log(formData.courses);
                setFormData((prevData) => ({
                  ...prevData,
                  course_name: "",
                }));
              }}
              className="btn btn-primary m-4 w-52"
              disabled={formData.course_name === ""}
            >
              Add Course
            </button>
            {formData.courses.length > 0 ? (
              <>
                <h3 className="text-white text-md sm:text-xl">Courses Added</h3>
                <table className="table border-0">
                  <thead>
                    <tr className="text-center text-md md:text-lg">
                      <th>Sr. No.</th>
                      <th>Course Name</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.courses.map((course, index) => (
                      <tr className="text-center" key={index + 1}>
                        <td className="dark:text-white text-white text-md sm:text-xl">
                          {index + 1}
                        </td>
                        <td
                          key={index}
                          className="dark:text-white text-black text-sm sm:text-xl"
                        >
                          {course}
                        </td>
                        <td>
                          <CloseOutlined
                            onClick={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                courses: prevData.courses.filter(
                                  (c) => c !== course
                                ),
                              }));
                              console.log(formData.courses);
                            }}
                            className="hover:text-white text-gray-400"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}
          </div>

          <div className="flex items-end justify-end gap-2">
            <div className="modal-action">
              <form method="dialog" className="">
                <button
                  id="cancel_add_institute_dialog"
                  className="btn btn-error"
                >
                  Cancel
                </button>
              </form>
            </div>
            <button
              onClick={handleSubmit}
              disabled={
                formData.address === "" ||
                formData.name === "" ||
                formData.description === ""
              }
              className="btn btn-success"
            >
              {createLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </dialog>

      {/* View Courses Modal */}
      <dialog id="view_courses_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Institute Courses</h3>
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr className="text-center text-md md:text-lg">
                  <th>ID</th>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {coursesLoading ? (
                  <tr>
                    <td
                      role="status"
                      className=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
                      colSpan={5}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full"></div>
                      </div>
                      <span className="sr-only">Loading...</span>
                    </td>
                  </tr>
                ) : courses.length > 0 ? (
                  courses.map((course, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{course}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={2}>
                      No Courses Created
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                id="cancel_view_courses_dialog"
                onClick={() => setCourses([])}
                className="btn btn-error"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default CreateInstitutes;
