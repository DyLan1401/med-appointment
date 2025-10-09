import React from "react";

import avatar from "../../assets/avatar.jpg";
export default function Section2() {
    const posts = [
        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        },
        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        },
        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        },
        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        },
        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        },

        {
            img: avatar,
            title: "Tư vấn sức khỏe",
            par: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea mollitia vero eum provident.Vero tenetur suscipit aspernatur vitae rerum quis, modi et neque ipsa repudiandae asperiores, ratione cumque perferendis enim."

        }



    ]
    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="text-3xl font-bold py-5 text-blue-400">Tin Tức Sức Khỏe
                    <hr />
                </div>
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-full h-full  py-5">
                        <div className="grid grid-cols-3 gap-5  " >
                            {posts.map((post, index) => (
                                <div
                                    key={index}
                                    className="w-fit h-auto  bg-white shadow-2xl">
                                    <div>
                                        <img
                                            className=" w-full h-64 bg-center object-cover"
                                            src={post.img} alt="" />
                                    </div>
                                    <div className=" flex flex-col gap-y-2 p-3 ">
                                        <div className="font-semibold text-2xl  ">{post.title}</div>
                                        <div className="text-sm">{post.par}</div>
                                        <a className="text-blue-600 font-semibold text-md" href="">Đọc thêm</a>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}