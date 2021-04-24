import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  // const [followed, setFollowed] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  // console.log(userId);
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setUserProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        // console.log(data);
        // setFollowed(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        // console.log(data);
        // setFollowed(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "30px 10px",
              borderBottom: "1px solid",
            }}
          >
            <div>
              <img
                style={{ height: "200px", width: "200px", borderRadius: "50%" }}
                src={userProfile.user ? userProfile.user.pic : "loading.."}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{
                    width: "120px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  type="submit"
                  className="btn btn-medium waves-effect hoverable #ff5252 red accent-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              ) : (
                <button
                  style={{
                    width: "100px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  type="submit"
                  className="btn btn-medium waves-effect hoverable #ff5252 red accent-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
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

export default UserProfile;
