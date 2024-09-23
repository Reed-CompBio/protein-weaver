import React from "react";
import videoFile from "../assets/demo_video.mp4"; // Adjust path as needed

const HomeVideo = () => {
    return (
        <div>
            <video autoPlay muted loop width="100%" className="home-query-video">
                <source src={videoFile} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default HomeVideo;
