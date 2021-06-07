const IT = {
  name: "nome",
  outcome: "esito",
  revision: "revisione",
  status: "stato",
  verified: "verificato",
  edit: "modifica",
  submit: "invia",
  cancel: "annulla",
  select: "Seleziona",
  updated_at: "aggiornato il",
  view: "visualizza",
  save_draft: "salva bozza",
  add_more: "aggiungi elemento",
  no_node_found: "non è ancora presente nessun contenuto",
  no_result_found: "nessun risultato",
  go_on: "prosegui",
  publish_node: "pubblica",
  give_feedback: "Aiutaci a migliorare il servizio",
  external_link: "Collegamento a sito esterno",
  form_errors_warning:
    "assicurati di aver corretto tutti gli errori ed aver compilato tutti i campi obbligatori prima di salvare il modulo",
  cookiebar: {
    alert:
      "Questo sito utilizza cookie tecnici, analytics e di terze parti. Proseguendo nella navigazione accetti l’utilizzo dei cookie.",
    settings: "Vai alle preferenze",
    accept: "Accetto i cookies"
  },
  errors: {
    content_not_found: "contenuto non trovato",
    unauthorized: "utente non autorizzato",
    error_getting_data:
      "si è verificato un errore durante il recupero dei dati, puoi comunque riprovare a effettuare l'operazione.",
    error_sending_data:
      "si è verificato un errore durante l'invio dei dati, puoi comunque riprovare a effettuare l'operazione.",
    too_many_requests:
      "hai effettuato troppe richieste nell'arco di tempo. Riprova più tardi.",
    file_too_large:
      "La dimensione del file ({{size}} kb) è maggiore di quella consentita ({{maxSize}} kb)"
  },
  follow_us: "seguici su",
  auth: {
    email_verification_required: "la verifica dell'indirizzo email è obbligatoria",
    email_verified: "email verificata correttamente !",
    verify_email_text: "Inserisci il codice che hai ricevuto per email",
    verify_token_text: "verifica il codice",
    pa_placeholder: "Nome o codice IPA...",
    description:
      "Per poter procedere alla compilazione di un modulo è necessario identificare l’amministrazione. La mail del relativo Responsabile per la transizione digitale (RTD) deve essere già presente all’interno dell’<0>Indice delle Pubbliche Amministrazioni (IPA)</0>. Procedi con la scelta della PA oppure leggi la guida su <1>come accedere</1>.",
    email_sent:
      "un'email contenente la chiave di accesso è stata inviata all'indirizzo",
    email_to_be_sent:
      "Richiedo che venga inviata la chiave di accesso alla casella email del Responsabile della Transizione Digitale: {{email}}",
    email_to_be_sent_school:
      "Richiedo che venga inviata la chiave di accesso alla casella email della scuola: {{email}}",
    expired_session:
      "la tua sessione è scaduta, è necessario effettuare un nuovo login",
    // tslint:disable-next-line: no-hardcoded-credentials
    has_password: "ho già la chiave di accesso",
    insert_secret: "inserisci la chiave di accesso che hai ricevuto per email:",
    login: "Accedi",
    how_to_log_in: "Come accedere",
    // tslint:disable-next-line: no-hardcoded-credentials
    not_has_password: "desidero ricevere una chiave di accesso",
    send_me_email: "invia email",
    select_pa: "Cerca la tua amministrazione",
    select_pa_hint:
      "inserisci la denominazione della tua amministrazione o il codice ipa",
    rtd_not_found:
      "l'indirizzo email del responsabile per la transizione digitale non è stato ancora inserito nell'indice delle pubbliche amministrazioni, pertanto non è possibile proseguire con l'autenticazione. Puoi verificarlo visitando la pagina relativa:",
    school_mail_is_null:
      "l'indirizzo email della scuola (non PEC) non è stato ancora inserito nell'indice delle pubbliche amministrazioni, pertanto non è possibile proseguire con l'autenticazione. Puoi verificarlo visitando la pagina relativa:",
    // tslint:disable-next-line: no-hardcoded-credentials
    wrong_password:
      // tslint:disable-next-line: no-hardcoded-credentials
      "la chiave immessa non è corretta o è scaduta, prova a richiedere una nuova chiave"
  },
  login: "accedi",
  logout: "logout",
  loading_data: "caricamento dei dati in corso...",
  deleting_data: "eliminazione dei dati in corso...",
  delete: "elimina",
  not_latest_version:
    "alcune modifiche al contenuto non sono ancora state pubblicate.",
  draft_version: "il contenuto visualizzato risulta ancora in bozza.",
  not_published_version:
    "il contenuto visualizzato presenta alcune modifiche rispetto alla versione pubblicata.",
  view_latest_version: "visualizza il contenuto con le ultime modifiche",
  view_published_version: "visualizza la versione pubblicata del contenuto",
  pages: {
    index_page_title: "Form",
    action_page_title: "Form",
    action_goto_form: "Accedi al modulo",
    dashboard_title: "Dashboard",
    notfound_page_title: "Pagina non trovata",
    notfound_page_text: "Pagina non trovata",
    unauthorized_page_title: "Utente non autorizzato",
    unauthorized_page_text: "Utente non autorizzato",
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
