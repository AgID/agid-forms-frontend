/**
 * Template for node of type "feedback-accessibilità".
 */
import * as React from "react";

import { navigate } from "gatsby";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const PublishModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      onClosed={() => navigate("/")}
      contentClassName="rounded"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)} tag="h2" className="px-5">
        Grazie, la segnalazione è stata correttamente inviata!
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="d-flex">
          <p className="pt-4 w-paragraph" />
          <img
            src={"/images/modals/invitation.svg"}
            alt=""
            style={{ width: "150px" }}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

const ViewTemplate = () => {
  return (
    <div className="py-lg-4">
      <PublishModal />
    </div>
  );
};

export default ViewTemplate;
