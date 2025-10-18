<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { $query = Post::with(['user', 'category'])->orderBy('id', 'desc');

    if ($request->has('category_id') && $request->category_id) {
        $query->where('category_id', $request->category_id);
    }

    if ($request->has('search') && $request->search !== '') {
        $keyword = $request->search;
        $query->where('title', 'like', "%{$keyword}%")
              ->orWhere('content', 'like', "%{$keyword}%");
    }

    return response()->json($query->paginate(6));
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
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'user_id' => 'nullable|integer|exists:users,id',
            'category_id' => 'nullable|integer|exists:categories_post,id',
        ]);

      if ($request->hasFile('image')) {
    $path = $request->file('image')->store('posts', 'public');
    $validated['image'] = asset('storage/' . $path); // ✅ trả link đầy đủ

    }

    $post = Post::create($validated);

    return response()->json(['message' => 'Post created successfully', 'data' => $post], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
{
    $post = Post::with(['user', 'category'])->findOrFail($id);
    return response()->json($post);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $post = Post::findOrFail($id);

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'nullable|string',
        'category_id' => 'nullable|integer|exists:categories_post,id',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    if ($request->hasFile('image')) {
    $path = $request->file('image')->store('posts', 'public');
    $validated['image'] = asset('storage/' . $path); // ✅ trả link đầy đủ
}

    $post->update($validated);

    return response()->json(['message' => 'Post updated successfully', 'data' => $post], 200);
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully'], 200);
    
    }
}
