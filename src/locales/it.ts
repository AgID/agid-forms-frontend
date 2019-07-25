const IT = {
  name: "nome",
  outcome: "esito",
  revision: "revisione",
  status: "stato",
  edit: "modifica",
  updated_at: "aggiornato il",
  view: "visualizza",
  save_draft: "salva bozza",
  add_more: "aggiungi elemento",
  publish_node: "pubblica",
  form_errors_warning:
    "assicurati di aver corretto tutti gli errori ed aver compilato tutti i campi obbligatori prima di salvare il modulo",
  errors: {
    content_not_found: "contenuto non tovato",
    error_getting_data:
      "si è verificato un errore durante il recupero dei dati, puoi comunque riprovare a effettuare l'operazione.",
    error_sending_data:
      "si è verificato un errore durante l'invio dei dati, puoi comunque riprovare a effettuare l'operazione.",
    too_many_requests:
      "hai effettuato troppe richieste nell'arco di tempo. Riprova più tardi."
  },
  follow_us: "seguici su",
  auth: {
    email_sent:
      "un'email contenente la password di accesso è stata inviata all'indirizzo",
    email_to_be_sent:
      "proseguendo verrà inviata un'email all'indirizzo del responsabile per la transizione digitale dell'ente {{paName}}: {{email}}",
    expired_session:
      "la tua sessione è scaduta, è necessario effettuare un nuovo login",
    // tslint:disable-next-line: no-hardcoded-credentials
    has_password: "ho già la password",
    insert_secret: "inserisci la password che hai ricevuto per email:",
    login_as: "accedi come {{selectedPa}}",
    // tslint:disable-next-line: no-hardcoded-credentials
    not_has_password: "devo ancora ottenere la password",
    select_pa: "seleziona un'amministrazione:",
    select_pa_hint:
      "puoi cercare l'amministrazione per nome o inserendo direttamente il codice ipa",
    rtd_not_found:
      "l'indirizzo email del responsabile per la transizione digitale non è stato ancora inserito nell'indice delle pubbliche amministrazioni, pertanto non è possibile proseguire con l'autenticazione. Puoi verificarlo visitando la pagina relativa:",
    // tslint:disable-next-line: no-hardcoded-credentials
    wrong_password: "la password immessa non è corretta"
  },
  login: "accedi",
  logout: "logout",
  loading_data: "caricamento dei dati in corso...",
  not_latest_version:
    "alcune modifiche al contenuto non sono ancora state pubblicate.",
  not_published_version:
    "il contenuto visualizzato presenta alcune modifiche rispetto alla versione pubblicata.",
  view_latest_version: "visualizza il contenuto con le ultime modifiche",
  view_published_version: "visualizza la versione pubblicata del contenuto",
  pages: {
    index_page_title: "Moduli",
    action_page_title: "Moduli",
    dashboard_title: "Dashboard",
    notfound_page_title: "Pagina non trovata",
    notfound_page_text: "Pagina non trovata",
    revision_title: "Visualizza la revisione del contenuto",
    view_title: "Visualizza il contenuto"
  },
  sending_data: "invio dei dati in corso...",
  skiplinks: {
    goto_footer: "vai al footer",
    goto_main: "vai al contenuto principale"
  },
  toggle_navigation: "link di navigazione",
  status_name: {
    draft: "bozza",
    in_review: "in revisione",
    published: "pubblicato",
    archived: "archiviato"
  }
};

export default IT;
