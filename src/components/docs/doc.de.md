# ATN SMT Management Dokumentation

ATN SMT Management ermöglicht Ihnen die Verwaltung Ihrer ATN SMT Bestückungsautomaten und ATN Smart Shelf Automaten. Es unterstützt auch die Materialverwaltung und das Produktionsmanagement über die Weboberfläche, indem es die Produktionsaufträge und deren benötigten Materialfluss von der Anlieferung bis zum fertigen Produkt organisiert. Der Arbeitsablauf im ATN SMT Management ist in drei verschiedenen Stationen organisiert (Materialeingang, Materiallager, Rüstzentrum) und der Materialfluss wird vom Materialeingang zum Rüstzentrum geleitet.

Um auf das ATN SMT Management zuzugreifen, müssen Sie die Adresse [http://localhost:5000] über einen Webbrowser von einem Gerät aus aufrufen, das sich im gleichen lokalen Netzwerk wie der Server befindet und sich mit Ihrem Benutzernamen und Passwort anmelden.

[<img src="http://localhost:5000/assets/img/Dashboard.gif" width="100%" class="center"/>](Dashboard)

Vom Dashboard aus können Sie über die entsprechenden Schaltflächen auf die verschiedenen Stationen zugreifen, und auch über die linke Seitenleiste ist der Zugriff auf verschiedene Stationen jederzeit möglich. Das Dashboard zeigt den aktuellen Status der Stationen und die aktuellen Aufträge im Setup-Center an.

---

## Wareneingang

Diese Station verarbeitet die Eingabe verschiedener Materialtypen in das System (Artikel, Charge und Feeder), ausgehend von Excel-Dateien, und zeigt das Material in der Chargetabelle an. Die enthält die Informationen über die Charge und die darin enthaltenen Artikel. Sie kann über ein Suchfeld gefiltert werden. Und nach den verschiedenen Spalten sortiert werden. Gelieferte Charge können markiert werden, indem ihre Etiketten ausgedruckt werden, woraufhin das Drucksymbol grün wird.

In der rechten Seitenleiste können verschiedene Materialien importiert werden.

### Artikel hinzufügen

Um einen einzelnen Artikel zu importieren, kann die Schaltfläche "Artikel hinzufügen" verwendet werden. Benötigte Informationen für jeden Artikel sind die Artikelnummer und die Beschreibung des Artikels, andere Informationen sind optional.

- Artikelnummer: der eindeutige Identifikator für jeden Artikel (QR-Code).
- Beschreibung: eine kurze Beschreibung des Artikels.
- Verpackung: die Nummer der Verpackung des Artikels.
- Lieferant: der Name des Lieferant des Artikels.
- Beschreibung des Lieferants: Die Beschreibung des Lieferant des Artikels.
- Hersteller: Der Name des Herstellers des Artikels.
- Beschreibung des Herstellers: Beschreibung des Artikels durch den Hersteller.
- Standort: Adresse des traditionellen Lagerortes des Artikels
- SAP-Nummer

[<img src="http://localhost:5000/assets/img/Add_Article.PNG" width="100%" class="center"/>](AddArticle)

### Artikel importieren

Artikel können auch aus Excel-Dateien importiert werden, indem Sie auf die Schaltfläche Importieren klicken. Über die Schaltfläche "Importieren" wird ein Datei-Explorer-Fenster geöffnet. Nach Auswahl der Datei wird der Benutzer aufgefordert, die Spalten der Dateien auszuwählen, die den gewünschten Informationen entsprechen. Nachdem die Artikel importiert wurden, wird ein Dialog mit den importierten Artikeln angezeigt.

[<img src="http://localhost:5000/assets/img/Import_Articles.PNG" width="100%" class="center"/>](ImportArticles)

### Charge hinzufügen

Wenn ein neuer Charge bestellt wird, muss er auch zur Software-Datenbank hinzugefügt werden. Dies kann individuell über die Schaltfläche "Charge hinzufügen" erfolgen. Es wird ein neuer Dialog angezeigt, in dem der Benutzer aufgefordert wird, die erforderlichen Informationen einzugeben. Erforderliche Informationen sind die UID des Charges und der Artikel, den dieser Charge enthält. Informationen über die Größe und den Typ des Charges sind ebenfalls für die richtige Zuordnung in den Lagergeräten erforderlich.

- UID des Charges: der eindeutige Identifikator für jeden Charge (QR-Code).
- Artikel: der Artikel, den der Charge enthält.
- Menge: Die Menge ist die Anzahl der Komponenten, die der Charge enthält.
- Typ: Typ des Charges (Rolle, Tasche, Tray und einzeln)
- Breite: Die Breite des Rollen Chargen.
- Durchmesser: Der Durchmesser des Charges.
- Lotnummer: Identifikationsnummer des Herstellers.

[<img src="http://localhost:5000/assets/img/Add_Carrier.PNG" width="100%" class="center"/>](AddCarrier)

### Chargen importieren

Chargen können auch aus Excel-Dateien importiert werden, indem Sie auf die Schaltfläche Importieren klicken. Über die Schaltfläche "Chargen Importieren" wird ein Datei-Explorer-Fenster geöffnet. Nach Auswahl der Datei wird der Benutzer aufgefordert, die Spalten der Dateien auszuwählen, die den gewünschten Informationen entsprechen.

[<img src="http://localhost:5000/assets/img/Import_Carriers.PNG" width="100%" class="center"/>](ImportCarriers)

### Feeder hinzufügen

Um Feeder zur ATN SMT Management Software hinzuzufügen, kann die Schaltfläche "Feeder hinzufügen" verwendet werden. Die Schaltfläche "Feeder hinzufügen" öffnet einen neuen Dialog, in dem der Benutzer aufgefordert wird, die erforderlichen Informationen einzugeben.

- Feeder UID: Wird für den QR-Code des Feeders verwendet. (QR-Code)
- Beschreibung: Eine Beschreibung des Feeders.

[<img src="http://localhost:5000/assets/img/Import_Feeder.PNG" width="60%" class="center"/>](AddFeeder)

---

## Lager

Die Materiallagerstation ermöglicht es dem Benutzer, das in verschiedenen Lagern sowie Pick & Place-Maschinen gelagerte Material zu untersuchen. Der Inhalt des Materiallagers kann über ein Suchfeld gefiltert werden. Und nach den verschiedenen Spalten sortiert werden.

[<img src="http://localhost:5000/assets/img/MaterialStorage.gif" width="100%" class="center"/>](MaterialStorage)

Die ATN-Regale können von dieser Seite aus bedient werden. Über die Einträge in der rechten Seitenleiste kann der Benutzer:

- Charge anzeigen: Durch Auswahl dieses Eintrags und Scannen des QR-Codes des Charges werden die Informationen zum Charge angezeigt und sein Standort wird durch die LED angezeigt und indiziert, wenn er im intelligenten Regal gespeichert wurde.
- Charge hinzufügen: Wenn Sie diesen Eintrag wählen und den QR-Code des Charges scannen, wird der Charge in den ersten freien Steckplatz des gewählten Speichermediums eingefügt. Dieser Platz wird durch eine grün blinkende LED gekennzeichnet. Durch Scannen eines weiteren QR-Codes wird der neue Charge in den nächsten freien Steckplatz verschoben. Die blinkende LED kann eventuell durch Bestätigen der erhaltenen Benachrichtigung ausgeschaltet werden.
- Charge abholen: Dieser Eintrag hat zwei Funktionen: Erstens wird ein Charge in die Abholwarteschlange aufgenommen und sein Steckplatz durch blaues Blinken markiert, wenn der QR-Code zum ersten Mal gescannt wird, falls die Charge gemäß einem gedruckten Auftrag abgeholt werden. Zweitens bestätigt es die Abholung des Charges aus dem Speichermedium durch Scannen des QR-Codes des Charges und schaltet dessen Steckplatzmarkierung aus.
- Charge löschen: Dieser Eintrag löscht einen Charge aus dem Speichermedium und der Datenbank durch Scannen des QR-Codes des Charges.
  Auftrag abholen: Durch Auswahl eines Auftrags in diesem Auswahlfeld wird das reservierte Material in den Lagergeräten zur Warteschlange hinzugefügt und die Schlitzmarkierung blinkt blau; durch Scannen des QR-Codes jedes Charges wird dessen Abholung bestätigt.

---

## Setup center

In dieser Station kann der Materialverbrauch in der Produktion geplant werden, bevor die Produktion beginnt. Dies wird durch die Organisation des Verbrauchs in Form von Aufträgen erreicht. Jeder Auftrag enthält Informationen über das Endprodukt, das für die Produktion benötigte Material und andere Auftragsattribute. Diese Aufträge und ihr Status können in der Auftragstabelle eingesehen werden. Grün markierte Aufträge sind Aufträge, deren Start innerhalb eines Tages geplant ist und die daher vorbereitet werden sollten. Gelb markierte Aufträge sind Aufträge, die sich auf den Maschinen befinden sollten. Rot markierte Aufträge sind Aufträge, deren Produktion abgeschlossen sein sollte.

[<img src="http://localhost:5000/assets/img/SetupCenter.PNG" width="100%" class="center"/>](SetupCenter)

Diese Aufträge können über die Werkzeuge in der rechten Seitenleiste erstellt und verwaltet werden.

### Auftrag erstellen

Um einen neuen Auftrag zu starten, kann die Schaltfläche "Auftrag erstellen" verwendet werden. Daraufhin öffnet sich ein neuer Dialog, in dem der Benutzer aufgefordert wird, die erforderlichen Informationen einzugeben. Diese Informationen sind:

[<img src="http://localhost:5000/assets/img/CreateJob.PNG" width="90%" class="center"/>](CreateJob)

- Auftragsname: Der Name des Auftrags. (erforderlich)
- Stellenbeschreibung: Eine Beschreibung der Stelle. (Erforderlich)
- Platte: Der Name der Platte, die in diesem Auftrag produziert wird.
- Anzahl: Die Anzahl der zu produzierenden Platinen. (Voreinstellung = 1)
- Projekt: das Projekt, das diesen Auftrag enthält.
- Projektbeschreibung
- Abteilung
- Kunde: der Name des Kunden, für den dieser Auftrag produziert wird.
- Maschine: Der Name der Maschine, die für diesen Auftrag verwendet werden soll.
- Startdatum: das Datum, an dem der Auftrag beginnen soll.
- Enddatum: Das Datum, an dem der Auftrag beendet werden soll.
- Auftragsartikel, für jeden Artikel:
  - Name des Artikels
  - Die Bank der Maschine, auf der der Artikel platziert ist
  - Der Steckplatz der Bank, auf der der Artikel platziert ist
  - Die Anzahl der Komponenten, die für diesen Artikel benötigt werden Alternativ können die Auftragsartikel und ihre Attribute auch direkt aus "Inoplacer"-Auftragsdateien importiert werden, indem die Schaltfläche "Aus Datei importieren" verwendet wird. Die Zeitleiste bietet einen umfassenden Überblick über die Auftragsverteilung auf den Maschinen, um die Auftragszeiten besser planen zu können.

[<img src="http://localhost:5000/assets/img/CreateJobTimeline.PNG" width="80%" class="center"/>](CJ_Timeline)

### Material vorbereiten

Nachdem der Auftrag erstellt wurde, kann das für die Produktion dieses Auftrags benötigte Material vorbereitet und reserviert werden, damit es zum Zeitpunkt der Produktion bereitsteht. Dies geschieht durch Klicken auf die Schaltfläche "Material vorbereiten". Daraufhin öffnet sich ein neuer Dialog, in dem der Benutzer aufgefordert wird, für jeden Artikel einen Träger auszuwählen.

Die Tabelle auf der linken Seite zeigt die für den Auftrag benötigten Artikel und die Tabelle auf der rechten Seite die für den gewählten Artikel verfügbaren Träger an. Wenn Sie auf einen Artikel klicken, wird die Träger-Tabelle für den gewählten Artikel aktualisiert. Wenn ein Träger ausgewählt wird, wird der Artikel überprüft. Artikel und Träger, die bereits auf den Bänken der ausgewählten Maschine für diesen Auftrag vorhanden sind, werden mit einer anderen Farbe angezeigt, um den Bedienern mitzuteilen, dass sie nicht vorbereitet werden müssen (aus dem Lager entnommen und auf Zuführungen montiert).

[<img src="http://localhost:5000/assets/img/PrepareMaterial.gif" width="80%" class="center" />](PrepareMaterial)

Das reservierte Material kann nun unter Angabe des Auftrag Abholen in der Station "Lager" aus dem Lager abgeholt werden.

### Maschine demontieren

Bevor die Maschine mit dem Material für den nächsten Auftrag versorgt wird, muss das Material des vorangegangenen Auftrags zunächst demontiert werden. Die Zuführungen an der Maschine können entweder einen Artikel enthalten, der direkt verwendet wird, einen Artikel, der später verwendet werden könnte, einen leeren Träger oder einen Artikel, der in Kürze nicht verwendet wird und wieder eingelagert werden sollte. Die Schaltfläche "Maschine demontieren" öffnet einen neuen Dialog, in dem der Benutzer zunächst die Maschine auswählen muss, die demontiert werden soll. Anschließend kann der QR-Code des Trägers oder der Zuführung gescannt werden, um die nächste geplante Verwendung dieses Trägers anzuzeigen. Diese Verwendung wird in einer Tabelle angezeigt, die den Auftragsnamen, das Startdatum, die Bank und die Slotnummer der nächsten Reservierungen des Trägers enthält, sortiert nach dem Startdatum, wobei das nächstliegende zuerst angezeigt wird. Wenn für diesen Träger keine Aufträge geplant sind, wird eine blaue Benachrichtigung angezeigt, und der Träger kann über die Schaltfläche neben dem Scan-Eingang abgemeldet werden. Durch das Abnehmen eines Trägers wird sowohl die Zuführung vom Gerät als auch der Träger von der Zuführung abmontiert.

[<img src="http://localhost:5000/assets/img/DisassambleMachine.gif" width="80%" class="center" />](DisassambleMachine)

### Auftrag Rüsten

Nachdem die Maschine demontiert wurde, kann das neue Material auf die Maschine montiert werden, d. h. der Träger wird auf die Zuführung und dann auf die Maschine montiert. Klicken Sie dazu auf die Schaltfläche "Pre-Setup Job". Dadurch wird ein neues Dialogfeld geöffnet, in dem der Benutzer aufgefordert wird, zunächst den Auftrag für die Voreinstellung auszuwählen. Durch das Scannen eines Trägers und dann eines Zuführers wird der Träger auf dem Zuführer montiert und seine Position auf der Maschine kann anhand der Tabelle für die korrekte Montage auf der Maschine erkannt werden.

[<img src="http://localhost:5000/assets/img/PreSetup.gif" width="80%" class="center" />](PreSetup)

### Setup kontrollieren

Bevor der Auftrag gestartet wird, kann die Materialsortierung auf der Maschine über die Schaltfläche "Check Setup" überprüft werden. Nach Auswahl des zu prüfenden Auftrags und der Bank werden die Feeder/Träger vom Anfang bis zum Ende der Bank gescannt. Jeder Fehler bei der Sortierung der Feeder wird durch visuelle und akustische Benachrichtigungen angezeigt. Die Steckplatznummer jedes Feeders wird beim Scannen ebenfalls angezeigt. Ob sich die Zuführung jedoch auf dem richtigen Steckplatz befindet oder nicht, muss der Benutzer überprüfen.

### Auftrag abschließen

Schließlich kann der Auftrag als beendet markiert und das verbrauchte Material über die Schaltfläche "Auftrag beenden" aktualisiert werden. Daraufhin öffnet sich ein neues Dialogfeld, in dem der Benutzer zunächst den zu beendenden Auftrag auswählen muss; das verbrauchte Material wird in der Tabelle in diesem Dialogfeld angezeigt. Für jeden Träger werden die folgenden Zahlen angezeigt:
Soll-Verbrauch: die berechnete Anzahl der Komponenten, die für diesen Auftrag hätten verwendet werden sollen.
Maschinenverbrauch: die Anzahl der verwendeten Komponenten, die von der Maschine abgerufen wurden.
Differenz: die Anzahl der Komponenten, die während der Produktion und beim Ein- und Ausbau der Träger verloren gegangen sind.
Tatsächliche Verwendung: die Anzahl der letztendlich ausgewählten Komponenten (wenn Maschine erkannt wird, Maschinenverwendung + Differenz, wenn nicht, Soll-Verwendung + Differenz) wird berechnet und kann vom Benutzer bearbeitet werden.

---

## Admin

### Add user

---
