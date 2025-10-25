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

export type ResumeAnalyseLCRequest = {
 thread_id:string;
 interrupt_id:string;
 answer:boolean;
};


export function isAnalyseLCRequest(obj: any): obj is AnalyseLCRequest {
  return obj 
    && Array.isArray(obj.images) 
    && Array.isArray(obj.documents);
}