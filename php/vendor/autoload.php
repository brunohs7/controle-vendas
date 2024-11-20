<?php

// Autoload para a biblioteca Dotenv
spl_autoload_register(function ($class) {
    $prefix = 'Dotenv\\';
    $base_dir = __DIR__ . '/vlucas/phpdotenv/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Autoload para a biblioteca PhpOption
spl_autoload_register(function ($class) {
    $prefix = 'PhpOption\\';
    $base_dir = __DIR__ . '/schmittjoh/php-option/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});


// Autoload para a biblioteca ResultType
spl_autoload_register(function ($class) {
    $prefix = 'GrahamCampbell\\ResultType\\';
    $base_dir = __DIR__ . '/grahamcampbell/result-type/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Autoload para a biblioteca Firebase JWT
spl_autoload_register(function ($class) {
    $prefix = 'Firebase\\JWT\\';
    $base_dir = __DIR__ . '/firebase/php-jwt/src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});
