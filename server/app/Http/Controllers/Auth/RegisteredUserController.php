<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use App\Models\CategoriesList;
use App\Models\ExternalLink;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);


        event(new Registered($user));

        Auth::login($user);

        CategoriesList::create(
            [
                'name' => '未分類',
                'order' => 0,
                'user_id' => $user->id
            ]
        );



        ExternalLink::create([
            'url' => 'https://kabutan.jp/stock/finance?code=[code]',
            'site_name' => '株探(決算)',
            'user_id' => $user->id
        ]);

        return response()->json(['message' => 'ユーザー登録成功']);
    }
}
