<?php
namespace App\Http\Controllers\Api; class ClassStoryController extends Controller { public function posts(Request $r){return ClassStoryPost::where('school_id',$r->user()->school_id)->where('class_id',$r->class_id)->latest()->get();} public function reactions(Request $r){return ClassStoryReaction::where('school_id',$r->user()->school_id)->where('class_id',$r->class_id)->get();} }
