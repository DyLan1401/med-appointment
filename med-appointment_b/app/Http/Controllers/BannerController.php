<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $banners = Banner::orderBy('id', 'desc')->get();
        return response()->json($banners);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
    $path = $request->file('image')->store('posts', 'public');
    $validated['image'] = asset('storage/' . $path); 
        }

        $banner = Banner::create($validated);

        return response()->json(['message' => 'Tạo banner thành công', 'data' => $banner], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
         $banner = Banner::findOrFail($id);
        return response()->json($banner);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
       //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
         $banner = Banner::findOrFail($id);

       $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

if ($request->hasFile('image')) {
    $path = $request->file('image')->store('posts', 'public');
    $validated['image'] = asset('storage/' . $path); // ✅ trả link đầy đủ
}

    $post->update($validated);

    
        return response()->json(['message' => 'Cập nhật banner thành công', 'data' => $banner]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        if ($banner->image && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();
        return response()->json(['message' => 'Đã xóa banner thành công']);
    }
    
}
