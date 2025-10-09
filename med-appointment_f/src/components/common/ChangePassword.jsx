
function ChangePassword() {

    return (
        <>
            <div className='w-full h-screen bg-amber-500'>
                <div className="w-full h-full justify-center items-center flex ">
                    <div className="rounded-lg w-[400px] h-[400px] font-semibold shadow-2xl bg-white px-10  justify-center ">
                        <h1 className='text-blue-300 text-3xl font-bold text-center py-5'>Đổi mật khẩu</h1>
                        <form action="" className='space-y-5'>
                            <div className='flex flex-col'>
                                <label htmlFor="">Mật khẩu mới</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="">xác nhận mật khẩu mới</label>
                                <input className='rounded-lg outline-1 outline-gray-500 p-2' type="text" />
                            </div>
                            <button className='w-full bg-gray-200 p-2 rounded-lg' type="">Đổi mật khẩu</button>
                        </form>

                        <div className=" text-center py-10 text-blue-700 ">
                            <a href="">Quay lại trang đăng nhập</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ChangePassword