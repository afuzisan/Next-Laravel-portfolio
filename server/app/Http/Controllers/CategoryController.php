<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class categoryController extends Controller
{
    public function index()
    {
        $user = Auth::id(); 
        Log::info($user.'user');
        $categories = Category::where('user_id', $user)->get(); 
        Log::info($categories.'categories');
        return response()->json($categories); 
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $category = Category::create([
            'name' => $request->name,
            // 'user_id' => auth()->user()->id,
            'user_id' => 1,
            'order' => 0,
        ]);

        return response()->json(['message' => 'Category created successfully', 'category' => $category]);
    }

    // public function delete($id)
    // {
    //     $category = Category::find($id);
    //     $category->delete();
    //     return response()->json(['message' => 'Category deleted successfully']);
    // }

    // public function update(Request $request, $id)
    // {
    //     $category = Category::find($id);
    //     $category->update($request->all());
    //     return response()->json(['message' => 'Category updated successfully']);
    // }
}
