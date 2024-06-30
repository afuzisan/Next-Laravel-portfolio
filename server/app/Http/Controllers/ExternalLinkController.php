<?php

namespace App\Http\Controllers;

use App\Models\ExternalLink;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    public function create(Request $request)
    {
        $url = $request->input('url');
        $site_name = $request->input('site_name');
        $user_id = Auth::id();

        // データベースに保存
        DB::table('external_links')->insert([
            'url' => $url,
            'site_name' => $site_name,
            'user_id' => $user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['url' => $url, 'site_name' => $site_name]); // 'url'をJSONで返す
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
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        DB::table('external_links')->where('id', $id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
