<?php

namespace App\Http\Controllers;

use App\Models\CategoryPost;
use Illuminate\Http\Request;

class CategoryPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
$query = CategoryPost::query();

        // Nếu có từ khóa tìm kiếm
        if ($request->has('search') && $request->search !== '') {
            $keyword = $request->search;
            $query->where('name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
        }

        $categories = $query->orderBy('id', 'desc')->get();
        return response()->json($categories);
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
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $category = CategoryPost::create($validated);

        return response()->json(['message' => 'Category created successfully', 'data' => $category], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $category = CategoryPost::findOrFail($id);
        return response()->json($category, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CategoryPost $categoryPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CategoryPost $categoryPost,$id)
    {
        $category = CategoryPost::findOrFail($id);
        $category->update($request->only(['name', 'description']));

        return response()->json(['message' => 'Category updated successfully', 'data' => $category], 200);
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
          $category = CategoryPost::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    
    }
}
