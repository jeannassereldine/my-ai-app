export type Image = {
  type: "image";
  image_url_base64: string;
};

export type Document = {
  type: "pdf_file";
  file_data_base64: string;
};

export type AnalyseLCRequest = {
  images: Image[];
  documents: Document[];
};
