<?php

namespace App\Http\Controllers;

use App\Models\ExternalLink;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ExternalLinkController extends Controller
{
    public function index()
    {
        $user = ExternalLink::all();
        return response()->json($user);
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
    public function show(ExternalLink $externalLink)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExternalLink $externalLink)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExternalLink $externalLink)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExternalLink $externalLink)
    {
        //
    }
}
