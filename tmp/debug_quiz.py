content = open('/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php').read()
idx = content.find('$alreadySubmitted = $query->exists()')
print(repr(content[idx-12:idx+700]))
