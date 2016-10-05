# phidias.css

Phidias CSS es un conjunto de reglas *puramente css* para asistir en el diseño de interfaces HTML

## Todo es una clase
Todos los *componentes* de phidias css se aplican como clases:

<div class="phi-page"> ...

Algunas tienen sentido con ciertos componentes HTML
<img class="phi-avatar"> ...

<h1 class="phi-title"></h1>
<p class="phi-subtitle"></p>


Los modificadores son nombres de clases que indican comportamiento del *componente*.
Cada *componente* define sus propios modificadores. Estos se identifican con el prefijo "is-"

<div class="phi-page is-collapsed"> ...
<div class="phi-page-navigation is-hidden"> ...


Modificadores especiales
Estos son globales y funcionan con cualquier elemento:

<h1 class="--hidden">Se prende y se apaga</h1>
<div class="--shown --animation-scale"></div>


En vue:
<h1 class="{'--shown': isVisible, '--hidden': !isVisible}">Se prende y se apaga</h1>