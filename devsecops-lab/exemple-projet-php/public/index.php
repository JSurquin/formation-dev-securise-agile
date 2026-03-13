<?php
// ❌ FAILLE XSS — donnée utilisateur affichée sans échappement
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . $name . "!</h1>";

// ✅ Version corrigée :
// echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
