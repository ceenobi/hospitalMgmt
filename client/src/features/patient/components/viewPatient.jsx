import Modal from "@/components/modal";
import { formatDate } from "@/utils/constants";

export default function ViewPatient({ patient, onClose, isOpen }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        id="viewPatientModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title="Patient Details"
        showClose
        onClose={onClose}
      >
        <div className="flex flex-col gap-4">
          <div className="divider m-0"></div>
          <div>
            <div className="flex gap-2">
              <p className="font-bold">Full Name:</p>
              <p className="font-medium">{patient?.fullname}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Email:</p>
              <p className="font-medium">{patient?.email}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Phone:</p>
              <p className="font-medium">{patient?.phone}</p>
            </div>
            <div className="divider m-0"></div>
            <div className="flex gap-2">
              <p className="font-bold">Gender:</p>
              <p className="font-medium">{patient?.gender}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Blood Group:</p>
              <p className="font-medium">{patient?.bloodGroup}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Date of Birth:</p>
              <p className="font-medium">{formatDate(patient?.dateOfBirth)}</p>
            </div>
            <div className="divider m-0"></div>
            <div className="flex gap-2">
              <p className="font-bold">Address:</p>
              <p className="font-medium">{patient?.address}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Emergency Contact:</p>
              <p className="font-medium">{patient?.emergencyContact}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Emergency Contact Number:</p>
              <p className="font-medium">{patient?.emergencyContactPhone}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Emergency Contact Relationship:</p>
              <p className="font-medium">
                {patient?.emergencyContactRelationship}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
