# MPROG Project - Process book

03-06-2019: Proposal afgemaakt. Ik heb de proposal die ik al tijdens data visualization heb gemaakt aangepast en uitgebreid.

04-06-2019: Design proposal geschreven en de eerste bespreking met Nigel gehad. Hier hebben we het probleem met de veranderende kaarten besproken. Ook heb ik gezocht of ik een bewerkbare lijst met huidige gemeenten en de gemeenten waar die uit bestonden kon vinden, maar dat is niet gelukt. Ik zal dus ofwel handmatig dit moeten opzoeken, wat te veel tijd kost, of de historische data kan alleen worden getoond bij gemeenten die al sinds 1946 hebben bestaan.

05-06-2019: Ik heb mijn data per gemeente in een JSON gestopt en heb een begin gemaakt aan de gewogen LR-score berekenen. Bij de standup heb ik mijn proposal uitgelegd. Qua feedback werd gesuggereerd om misschien te beginnen met provincies en daarna pas schalen naar gemeenten.

06-06-2019: Ik heb de gewogen LR-score per gemeente per jaar berekent en toegevoegd aan de dictionary van de gemeenten. Ook heb ik een juiste kaart voor de Nederlandse gemeenten gedownload en versimpeld (ten bate van de grootte.)

11-06-2019: Ik heb geprobeerd de kaart van Nederland te projecteren, maar dit is nog niet gelukt. Tot nu toe is de kaart nog heel klein, en ik krijg het nog niet voor elkaar om de kaart op de manier van linked views te projecteren. Er lijkt een fout te zitten in de topojson van de Nederlandse gemeenten. Ik ga dit morgen vragen.

12-06-2019: Ik heb gevraagd naar de kaart, maar de projectie is nog steeds niet gelukt. Wel heb ik nu de assen van de lijngrafiek kunnen tekenen.

13-06-2019: De kaart heb ik nu aan het werk gekregen en ik kan de namen van de gemeenten hier nu ook uit halen. Nu moet ik mijn datastructuur nog veranderen, aangezien de huidige vorm onhandig is bij het maken van de lijngrafiek. Zodra dit klaar is kan ik de twee datasets gaan koppelen en lijngrafieken gaan tekenen.

14-06-2019: Tijdens het feedback-moment met Nigel hebben we nog een keer naar mijn datastructuur gekeken, die nog wat verandering kan gebruiken. Ook voegt mijn data-algorithme nog niet altijd de juiste data in de JSON (met name bij de rile en de uitslagen van GroenLinks), waar ik deze dag aan gewerkt heb.

15-06-2019: Na veranderingen in mijn datastructuur en meer onderzoek naar de d3 line chart kan ik nu resultaten in een linechart tekenen. Dit gaat echter nog niet helemaal goed, en ik weet niet of dit ligt aan mijn data of aan JavaScript. Maandag zal ik hier naar vragen.
Ook ga ik vandaag proberen de laatste fouten uit mijn data te halen (zoals bijvoorbeeld dat elke gemeente bij 2017 dezelfde rile krijgt, of dat sommige partijnamen niet hetzelfde zijn doorgevoerd)
