import axios from "axios";
import { useState,useRef } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import SubmitButton from "../components/SubmitButton";
import Error from "../components/Error";
import * as Yup from "yup";

const PostSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Enter a title."),
  body: Yup.string(),
  url: Yup.string().url("URL must be a valid URL."),
});

type FormValues = {
  title: string;
  body: string;
  url: string;
  video:string
};

const CreatePost = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [video, setVideo] = useState< any>();
  const videoRef = useRef<any>();
 
  const initialValues: FormValues = {
    title: "",
    body: "",
    url: "",
    video:""
  };
  const handleFileUpload = async(values: FormValues)=>{
     const data = new FormData()
    console.log('tostrinf',video)
data.append("file", video)  
data.append("upload_preset", "udld5n25")
data.append("cloud_name","breellz")
fetch("https://api.cloudinary.com/v1_1/dgxz1xw8c/video/upload",{
method:"post",
body: data
})
.then(resp => resp.json())
.then(data => {
//  initialValues.video=data.url
 console.log("------",data.url,values)
  
 console.log(values)

   axios.post("/api/posts", {body:values.body,title:values.title,url:values.url, video:data.url});
      history.push("/");
   
})
.catch(err => console.log(err))

  }
  const handleSubmit = async (values: FormValues) => {
    try {
      console.log(values)
      setLoading(true);
      setError("");
       await handleFileUpload(values)
       
     
    } catch (e: any) {
      setLoading(false);
      const { data } = e.response;
      setError(data.message);
    }
  };

 
  return (
    <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <section className="max-w-md w-full space-y-8">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={PostSchema}
        >
          <Form className="space-y-6">
            <h1>Create a post</h1>
            <hr className="border-white" />
            <TextInput
              data-testid="title"
              name="title"
              type="text"
              placeholder="Title"
            />
            <TextArea
              id="body"
              name="body"
              type="text"
              placeholder="Text (optional)"
            />
            <TextInput
              id="url"
              name="url"
              type="text"
              placeholder="URL (optional)"
            />
           
         <div
         
            className={
              video
                ? " w-96   rounded-md  h-64 items-center justify-center flex"
                : "border-2 dark:border-gray-600  w-96 border-dashed border-borderWhiteGray rounded-md mt-8   h-64 items-center justify-center flex"
            }
          >
            {video ? (
              <>
                (
                  <video
                     onClick={() => {
                      videoRef!.current?.click();
                    }}
                    controls
                    src={URL.createObjectURL(video)}
                    className="h-full rounded-md"
                  />
                )
              </>
            ) : (
              <input
              id="video"
              ref={videoRef}
              name="video"
            type="file"
            className=""
            placeholder="Video"
            // ref={videoRef}
            accept= "video/*" 
            onChange={(e) => {
              if (!e.target.files || e.target.files.length === 0) {
                // you can display the error to the user
                console.error("Select a file");
                return;
              }
              setVideo(e.target.files[0]);
              // console.log(e.target.files[0]);
            }}
          />
            )}
                      </div>

            <SubmitButton
              data-testid="create-post-btn"
              loading={loading}
              className="text-base float-right"
            >
              POST
            </SubmitButton>
            {error && <Error error={error} />}
          </Form>
        </Formik>
      </section>
    </main>
  );
};

export default CreatePost;
