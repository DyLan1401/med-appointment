<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $doctors = Doctor::with('user')->get();
        return response()->json($doctors);
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
        \Log::info('Doctor store data:', $request->all());

    $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'specialization' => 'nullable|string',
        'bio' => 'nullable|string',
        'phone' => 'nullable|string'
    ]);

    try {
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'doctor',
            'phone' => $request->phone,
        ]);

        // ✅ Debug: kiểm tra user có tạo được không
        // dd('user_created', $user->id);

        $doctor = \App\Models\Doctor::create([
            'id' => $user->id,
            'specialization' => $request->specialization,
            'status' => 'offline',
            'bio' => $request->bio,
        ]);

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => $doctor->load('user')
        ]);
    } catch (\Throwable $e) {
        dd('error', $e->getMessage());
    }
}


    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor,$id)
    {
        $doctor = Doctor::findOrFail($id);
    $user = $doctor->user;

    $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'specialization' => 'nullable|string',
        'bio' => 'nullable|string',
        'phone' => 'nullable|string',
    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
    ]);

    $doctor->update([
        'specialization' => $request->specialization,
        'bio' => $request->bio,
        'status' => $request->status ?? $doctor->status,
    ]);

    return response()->json([
        'message' => 'Doctor updated successfully',
        'doctor' => $doctor->load('user'),
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor,$id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Doctor deleted successfully']);
    
    
    }
}
