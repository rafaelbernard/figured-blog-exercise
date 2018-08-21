<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostDestroyRequest;
use App\Http\Requests\PostIndexRequest;
use App\Http\Requests\PostStoreRequest;
use App\Http\Requests\PostUpdateRequest;
use App\Post;
use Illuminate\Http\Request;
use JWTAuth;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth',
            ['except' =>
                 ['index', 'show']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(PostIndexRequest $request)
    {
        $withDraft = $request->query('withDraft');

        if ($withDraft && $withDraft === 'true')
        {
            $posts = Post::with('user')->orderBy('updated_at', 'DESC')->get();
        } else
        {
            $posts = Post::with('user')->orderBy('updated_at', 'DESC')->get()->where('is_published', 1);
        }

        $response = [
            'message' => 'List of posts',
            'posts'   => $posts
        ];

        return response()->json($response, 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(PostStoreRequest $request)
    {
        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');

        $post = new Post([
            'title'        => $title,
            'content'      => $content,
            'is_published' => $is_published,
            'user_id'      => $request->user()->id
        ]);

        if (!$post->save())
        {
            $response = [
                'message' => 'An error ocurred while creating the post'
            ];

            return response()->json($response, 422);
        }

        $response = [
            'message' => 'Post created',
            'post'    => $post
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = Post::with('user')
            ->where(
                [
                    ['_id', $id],
                    ['is_published', '=', 1]
                ])
            ->firstOrFail();

        $response = [
            'message' => 'Post details',
            'post'    => $post
        ];

        return response()->json($response, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(PostUpdateRequest $request, $id)
    {
        $post = Post::with('user')->findOrFail($id);

        $title        = $request->input('title');
        $content      = $request->input('content');
        $is_published = $request->input('is_published');

        if (Post::where([['title', $title], ['_id', '!=', $id]])->first())
        {
            return response()->json(['message' => 'There is already a post with the same title'], 422);
        }

        $post->title        = $title;
        $post->content      = $content;
        $post->is_published = $is_published;

        if (!$post->update())
        {
            $response = [
                'message' => 'An error ocurred while updating the post'
            ];

            return response()->json($response, 422);
        }

        $response = [
            'message' => 'Post updated',
            'post'    => $post
        ];

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id, PostDestroyRequest $request)
    {
        $post = Post::with('user')->findOrFail($id);

        if (!$post->delete())
        {
            return response()->json(['message' => 'Deleting failed'], 422);
        }

        $response = [
            'message' => 'post deleted',
            'create'  => [
                'href'   => 'public/api/v1/post',
                'method' => 'POST',
                'params' => 'title, content, is_published, user_id'
            ]
        ];

        return response()->json($response, 200);
    }
}
