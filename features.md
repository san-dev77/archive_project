AU niveau de l'index.js j'utilise une compression pour certaines requetes
à l'aide 'compression' une librairie node.js qui permet de compresser
certaines requetes assez volumineuse si elle depasse 1 ko, cela
permettra d'une manière d'accelerer les performances du serveur express.

cors: est utilisé pour donner l'authorisation a mon front d'acceder a mon back

body-parser: permet de parser les data que je reçois de la base de données en json.

errorHandler: est un middleware qui me permet capturer toutes les erreurs plus haut et de les logger une fois que l'on arrive a cette ligne.
