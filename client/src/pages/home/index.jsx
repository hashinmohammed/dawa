import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStore } from "../../shared/store/useStore";
import { PATH } from "../../constants/path";
import customToast from "../../shared/ui/customToast";
import { client } from "../../lib/axios";

export function Home() {
  const { user, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const [useSameNumber, setUseSameNumber] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const handleLogout = async () => {
    await logout();
    customToast.success("Logged out successfully!");
    navigate(PATH.LOGIN);
  };

  const onSubmit = async (data) => {
    try {
      await client.post("/api/patients", data);
      customToast.success("Patient registered successfully!");
      reset();
    } catch (error) {
      console.error("Registration error:", error);
      customToast.error(
        error.response?.data?.message || "Failed to register patient",
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to={PATH.HOME}>
                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition">
                  Dawa Clinic
                </h1>
              </Link>
              {isAuthenticated && (
                <nav className="flex gap-4">
                  <Link
                    to={PATH.HOME}
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                  >
                    Register Patient
                  </Link>
                  <Link
                    to={PATH.PATIENT_LIST}
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                  >
                    Patient List
                  </Link>
                </nav>
              )}
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          /* Patient Registration Form */
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Patient Registration
              </h2>
              <p className="text-gray-600">
                Register a new patient by filling out the form below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Patient Name *
                </label>
                <input
                  {...register("name", {
                    required: "Patient name is required",
                  })}
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter patient name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age & Sex */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Age *
                  </label>
                  <input
                    {...register("age", {
                      required: "Age is required",
                      min: { value: 0, message: "Age must be positive" },
                      max: { value: 150, message: "Age must be valid" },
                    })}
                    type="number"
                    id="age"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter age"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sex"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sex *
                  </label>
                  <select
                    {...register("sex", { required: "Sex is required" })}
                    id="sex"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sex.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    type="tel"
                    id="phoneNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    WhatsApp Number
                  </label>
                  <input
                    {...register("whatsappNumber")}
                    type="tel"
                    id="whatsappNumber"
                    disabled={useSameNumber}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter WhatsApp number (optional)"
                  />
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      id="useSameNumber"
                      checked={useSameNumber}
                      onChange={(e) => {
                        setUseSameNumber(e.target.checked);
                        if (e.target.checked) {
                          const phoneNumber = watch("phoneNumber");
                          setValue("whatsappNumber", phoneNumber);
                        } else {
                          setValue("whatsappNumber", "");
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="useSameNumber"
                      className="ml-2 text-sm text-gray-600 cursor-pointer"
                    >
                      Same as phone number
                    </label>
                  </div>
                </div>
              </div>

              {/* Place */}
              <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Place *
                </label>
                <input
                  {...register("place", { required: "Place is required" })}
                  type="text"
                  id="place"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Enter place"
                />
                {errors.place && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.place.message}
                  </p>
                )}
              </div>

              {/* Department & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department *
                  </label>
                  <select
                    {...register("department", {
                      required: "Department is required",
                    })}
                    id="department"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                  >
                    <option value="">Select department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="ENT">ENT</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="doctor"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doctor *
                  </label>
                  <input
                    {...register("doctor", { required: "Doctor is required" })}
                    type="text"
                    id="doctor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter doctor name"
                  />
                  {errors.doctor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.doctor.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-base font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Welcome Card for Logged Out Users */
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome!
                  </h2>
                  <p className="text-gray-600">Please sign in to continue</p>
                </div>

                <div className="space-y-3">
                  <Link
                    to={PATH.LOGIN}
                    className="block w-full text-center px-6 py-3 text-base font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={PATH.SIGNUP}
                    className="block w-full text-center px-6 py-3 text-base font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-indigo-200"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
