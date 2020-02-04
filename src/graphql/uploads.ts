import gql from "graphql-tag";

export const UPLOAD_FILE = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
      version
      filename
      mimetype
    }
  }
`;

export const DELETE_UPLOADED_FILE = gql`
  mutation DeleteUploaded($id: String!) {
    deleteUploaded(id: $id)
  }
`;
