# Form AGID

## Concetti

Il frontend, scritto in Typescript, consiste in una personalizzazione di [GatsbyJS](https://www.gatsbyjs.org/),
un generatore di siti statici, utilizzato nel caso specifico installando alcune [route dinamiche](https://www.gatsbyjs.org/docs/client-only-routes-and-user-authentication/) per le pagine che richiedono una interazione con il [backend](https://github.com/AgID/agid-forms-backend).

Le funzionalità implementate sono:

- [generazione automatica di un form da un template YAML](../src/templates/node/form-template.tsx)
- [salvataggio dei dati immessi](../src/templates/node/form-template.tsx)
- [visualizzazione delle revisioni dei contenuti salvati](../src/templates/node/revision-template.tsx)
- [visualizzazione delle ultime revisioni pubblicate dei contenuti salvati](../src/templates/node/views-template.tsx)
- [visualizzazione dell'elenco dei contenuti salvati](../src/templates/dashboard/dashboard-template.tsx)

### Autorizzazioni sui contenuti

- Per ogni form esiste un _"node type"_ corrispondente nel backend.
- Ogni _"node type"_ ha associati uno o più ruoli utente che stabiliscono il permesso di scrittura per quel _"node type"_
- Ogni utente può creare un contenuto di un specifico _"node type"_ se appartiene a un ruolo che gli conferisce il permesso di scrittura
- Ogni utente visualizza esclusivamente i contenuti da lui creati

### Personalizzazione dei template di default

Per ogni _"node type"_ qualunque dei 3 template di default ([view](../src/templates/node/views-template.tsx), [revision](../src/templates/node/revision-template.tsx), 
[dashboard](../src/templates/dashboard/dashboard-template.tsx)) può essere sovrascritto tramite una [LoadableView](../src/components/LoadableView.tsx).

I template personalizzati risiedono nella directory [../src/custom](./src/custom); vanno posizionati
nella sotto-directory `../src/custom/templates/<node type>`; il nome e la struttura del filesystem 
ricalcano quelli dei template di default.

### Personalizzazione delle pagine e custom route

Per creare pagine statiche è possibile utilizzare il formato [MDX](https://mdxjs.com/) o `tsx` (Typescript + React).
La directory che contiene le pagine statiche è [../src/custom/pages/doc](../src/custom/pages/doc).

Se si vuole introdurre route dinamiche, è possibile farlo aggiungendole come file `tsx` dentro
[../src/custom/pages](../src/custom/pages). Vedi ad esempio la [route relativa alla dashboard personalizzata per la dichiarazione di accessibilità](../src/custom/pages/dashboard/dichiarazione-accessibilita.tsx).

### Internazionalizzazione

I template di base utilizzano [i18next](https://www.i18next.com/) per l'internazionalizzazione.
I file dei locales si trovano in [../src/locales/<codice lingua>](../src/locales).
Si possono agguingere ulteriori traduzioni in [../src/custom/locales](../src/custom/locales).

### Struttura di un form

Ogni form (che corrisponde a un _"node type"_ lato backend)
contiene necessariamente un file di configurazione che contiene 
la dichiarazioni dei diversi campi (nome, tipologia, widget UI, validazione, ...).

Il formato di questo file è documentato all'interno del file di esempio
[example.yml](../data/form/example.yml).

Opzionalmente, a un form può essere associato un menu contestuale 
([../data/menu](../data/menu)) e/o uno o più template personalizzati.

## Installazione per sviluppo in locale

Per eseguire il frontend in locale:

```sh
git clone https://github.com/AgID/agid-forms-frontend
cp env.example .env # editare il file
docker-compose up -d --build
```

**NB**: per poter generare le definizioni dei tipi Typescript
dallo schema Graphql del database la procedura `yarn generate` 
deve poter connettersi all'endpoint remoto indicato nella variabli di ambiente
`$HASURA_GRAPHQL_ENDPOINT`. In sostanza, è possibile eseguire
il frontend solo se è già on-line una istanza raggiungibile del backend (`Hasura`)
connessa al database `PostgreSQL`. 

In genere ciò avverrà facendo puntare la variabile d'ambiente `$HASURA_GRAPHQL_ENDPOINT` all'indirizzo locale
del server `Hasura` eseguito tramite il [docker-compose](https://github.com/AgID/agid-forms-backend/blob/master/docker-compose.yml)
del backend. In alternativa è possibile far puntare `$HASURA_GRAPHQL_ENDPOINT` all'indirizzo del
[server Hasura di produzione](https://database.form.agid.gov.it/v1/graphql) in modo da poter ragiungere lo schema.

_TODO_: permettere la generazione dei tipi da uno schema Graphql salvato localmente.

Le variabili del file di configurazione sono documentate
nel file di esempio [env.example](../env.example).

## Utilizzo di Graphql

Nel progetto viene utilizzato [Apollo](https://www.apollographql.com/) 
come [client per l'interrogazione dei dati tramite GraphQL](../src/graphql/client.ts).

In particolare i dati vengono attinti - utilizzando query Graphql - dai seguenti sistemi:

- [Backend AGID Form](../src/graphql/backend.ts): tramite [REST to Graphql](https://www.apollographql.com/docs/link/links/rest/)
- [Gatsby](../src/graphql/gatsby.ts): per interrogare gli YAML locali (file di configurazione e dichiarazioni dei form)
- [Hasura](../src/graphql/hasura.ts): per interrogare direttamente il database remoto
- [Uploads](../src/graphql/uploads.ts): per effettuare l'upload dei file (che avviene tramite una mutation Graphql)

### Generazione dei tipi Typescript per le query

Al fine di garantire la type-safety delle query Graphql, per ogni sistema (locale o remoto)
vengono generati tipi Typescript (tramite `yarn generate`) leggendo lo schema Graphql esposto.

In particolare:

- Backend AGID Form: lo schema è contenuto nel file locale [../api_backend.graphql](../api_backend.graphql)
- Gatsby: lo schema è generato eseguendo `gatsby develop` dal plugin [gatsby-plugin-extract-schema](https://www.gatsbyjs.org/packages/gatsby-plugin-extract-schema/)
- Hasura: lo schema è reperito dall'endpoint remoto indicato dalla variabile `$HASURA_GRAPHQL_ENDPOINT`
- Uploads: lo schema è contenuto nel file locale [../upload_server.graphql](../api_backend.graphql)

Gli schemi Hasura e Gatsby si aggiornano automaticamente, rispettivamente a ogni aggiornamento
dello schema del database e a ogni aggiornamento degli YAML di configurazione.

Gli schemi del backend per la conversione REST > Graphql (autenticazione + server di upload degli allegati)
vanno modificati manualmente a seconda delle modifiche alle API.

## Deploy in produzione

Il frontend è aggiornato in produzione effettuando un login alla macchina 
form.agid.gov.it ed eseguendo i seguenti comandi:

```sh
cd /home/ubuntu/agid-forms-frontend
git pull origin master # aggiorna all'ultima versione pubblicata su GitHub
docker-compose up -d --build
```

_TODO_: procedura di deploy automatica associata all'immagine pushata sul Dockehub AGID.

### Infrastruttura

Il frontend consta esclusivamente di file statici (`html`, `js`) serviti da ngnix.
Il file di configurazione di ngnix è presente nella root del progetto [../nginx.conf](nginx.conf).

Il server ngnix non è direttamente raggiungibile dall'esterno (internet), ma attraverso un proxy 
[Traefik](https://containo.us/traefik/) le cui regole sono configurate nel [docker-compose.yml](../docker-compose.yml).

In tal modo la generazione dei certificati TSL e il loro rinnovo viene gestito automaticamente
tramite Traefik + [Let's Encrypt](https://letsencrypt.org/).
