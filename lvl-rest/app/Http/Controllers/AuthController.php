<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserSigninRequest;
use App\Http\Requests\UserStoreRequest;
use App\User;
use JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['signin']]);
    }

    public function store(UserStoreRequest $request)
    {
        $email    = $request->input('email');
        $password = $request->input('password');
        $name     = $request->input('name');

        $user = new User([
            'name'     => $name,
            'email'    => $email,
            'password' => bcrypt($password)
        ]);

        $user->save();

        return response()->json($user, 201);
    }

    public function signin(UserSigninRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials))
        {
            return response()->json(['message' => 'Invalid credentials'], 403);
        }

        $user = User::where('email', $request->input('email'))->firstOrFail();

        $response = [
            'message' => 'Success',
            'user'    => $user,
            'token'   => $token];

        return response()->json($response, 200);
    }

    public function index()
    {
        $users = User::all();

        return response()->json($users, 200);
    }

}
