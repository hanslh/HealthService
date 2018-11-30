<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
	
	<head>
		<base href="/" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<title>{{ config('app.name') }}</title>

		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLF2e8KjhfdczTbFaFvrUyxBZBX-pCTdc"></script>

		<link href="/css/app.css" rel="stylesheet" type="text/css"/>
		<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel=stylesheet type=text/css>

	</head>

	<body>

		<div id="app"></div>
		
		<script type="text/javascript" src="js/app.js"></script>

	</body>

</html>