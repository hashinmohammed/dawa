import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PATH } from "../../../constants/path";
import { useRegisterPatient } from "../api/usePatientMutations";

export function RegistrationForm({ isAuthenticated }) {
  const [useSameNumber, setUseSameNumber] = useState(false);
  const [isCustomDepartment, setIsCustomDepartment] = useState(false);
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);

  const registerMutation = useRegisterPatient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      department: "General Practitioner",
      doctor: "Dr. Sarah Wilson",
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Patient Registration
        </h2>
        <p className="text-gray-600">
          Register a new patient by filling out the form below
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Row 1: Identity (Name, Age, Sex) */}
        <div className="md:col-span-6">
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
            autoFocus
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
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
            placeholder="Age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sex *
          </label>
          <div className="flex gap-4 mt-1">
            {["Male", "Female", "Other"].map((option) => (
              <label
                key={option}
                className="relative flex-1 cursor-pointer group"
              >
                <input
                  {...register("sex", { required: "Sex is required" })}
                  type="radio"
                  value={option}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-all duration-200 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-indigo-500 hover:bg-gray-50 peer-checked:hover:bg-indigo-700 whitespace-nowrap">
                  {option}
                </div>
              </label>
            ))}
          </div>
          {errors.sex && (
            <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
          )}
        </div>

        {/* Row 2: Contact (Phone, WhatsApp, Place) */}
        <div className="md:col-span-4">
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

        <div className="md:col-span-4">
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
            placeholder="Enter WhatsApp number"
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="useSameNumber"
              checked={useSameNumber}
              onChange={(e) => {
                setUseSameNumber(e.target.checked);
                if (e.target.checked) {
                  const phoneNumber = getValues("phoneNumber");
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

        <div className="md:col-span-4">
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
            <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
          )}
          <div className="mt-2 flex gap-4">
            {["Kasaragod", "Kanhangad", "Payyanur"].map((p) => (
              <div key={p} className="flex items-center">
                <input
                  type="checkbox"
                  id={`place-${p}`}
                  checked={watch("place") === p}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("place", p);
                    } else {
                      setValue("place", "");
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor={`place-${p}`}
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  {p}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Clinical (Department, Doctor) */}
        <div className="md:col-span-12 lg:col-span-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {[
                "General Practitioner",
                "Pediatrics",
                "Cardiology",
                "Orthopedics",
                "Gynecology",
              ].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => {
                    setValue("department", dept);
                    setIsCustomDepartment(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                    !isCustomDepartment && watch("department") === dept
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                  }`}
                >
                  {dept}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setValue("department", "");
                  setIsCustomDepartment(true);
                }}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                  isCustomDepartment
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                }`}
              >
                Other
              </button>
            </div>
            {isCustomDepartment && (
              <input
                {...register("department", {
                  required: "Department is required",
                })}
                type="text"
                id="department"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition animate-fade-in"
                placeholder="Enter department name"
                autoFocus
              />
            )}
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department.message}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor *
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {[
                "Dr. Sarah Wilson",
                "Dr. James Chen",
                "Dr. Emily Brooks",
                "Dr. Michael Ross",
                "Dr. David Patel",
              ].map((doc) => (
                <button
                  key={doc}
                  type="button"
                  onClick={() => {
                    setValue("doctor", doc);
                    setIsCustomDoctor(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                    !isCustomDoctor && watch("doctor") === doc
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                  }`}
                >
                  {doc}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setValue("doctor", "");
                  setIsCustomDoctor(true);
                }}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                  isCustomDoctor
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                }`}
              >
                Other
              </button>
            </div>
            {isCustomDoctor && (
              <input
                {...register("doctor", {
                  required: "Doctor is required",
                })}
                type="text"
                id="doctor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition animate-fade-in"
                placeholder="Enter doctor name"
                autoFocus
              />
            )}
            {errors.doctor && (
              <p className="mt-1 text-sm text-red-600">
                {errors.doctor.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 md:col-span-12">
          <button
            type="submit"
            className="w-full md:w-auto md:min-w-[200px] px-6 py-3 text-base font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 float-right"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}
