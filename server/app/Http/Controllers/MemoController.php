<?php

namespace App\Http\Controllers;

use App\Models\Memo;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Throwable;
use Illuminate\Support\Facades\Log; // Added this line

class MemoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $Memos = Memo::all();

        return response()->json($Memos);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Memo $memo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Memo $memo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Memo $memo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Memo $memo)
    {
        //
    }
}
