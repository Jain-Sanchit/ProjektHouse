import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

function Profile() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.myposts);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "projekthouse");
      data.append("cloud_name", "jainsanchit");
      fetch("https://api.cloudinary.com/v1_1/jainsanchit/image/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json()) // keep it in one line else use return res.json()
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATE_PIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <>
      {state ? (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              margin: "30px 10px",
              borderBottom: "1px solid",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "50%",
                  }}
                  src={state ? state.pic : "loading.."}
                />
                <div className="file-field input-field">
                  <div className="btn" style={{ marginBottom: "1rem" }}>
                    <span>Update Profile Image</span>
                    <input
                      type="file"
                      onChange={(e) => updatePhoto(e.target.files[0])}
                    />
                  </div>
                  <div className="file-path-wrapper" style={{ width: "0" }}>
                    <input className="file-path validate" type="text" />
                  </div>
                </div>
              </div>
              <div>
                <h4>{state ? state.name : ""}</h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "110%",
                  }}
                >
                  <h6>{data.length} Posts</h6>
                  <h6>{state.followers.length} Followers</h6>
                  <h6>{state.following.length} Following</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="gallery">
            {data.map((item) => {
              return <img className="item" src={item.photo} key={item._id} />;
            })}
          </div>
        </div>
      ) : (
        <h2>Loading....</h2>
      )}
    </>
  );
}

export default Profile;
