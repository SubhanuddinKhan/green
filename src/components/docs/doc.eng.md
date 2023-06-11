# ATN SMT Management documentation

ATN SMT management enables you to manage your ATN SMT pick and place machines and ATN smart shelf machines. It also supports material management and production management through the web interface by organizing the production jobs and their needed material flow from delivery until the finished product. The workflow in the ATN SMT management is organized in three different stations (Material entry, Material Storage, Setup center) and the material flow is directed from the material entry to the setup center.

To access the ATN SMT management you need to access the address [http://<IP>:5000] from a web browser from a device on the same local network of the server and login with your user name and password.

[<img src="http://localhost:5000/assets/img/Dashboard.gif" width="100%" class="center"/>](Dashboard)

from the dashboard you can access the different stations by their corresponding buttons, different stations can also be accessed all the time using the left sidebar. The dashboard shows the current status of the stations and the current jobs in the setup center.

---

## Material entry

This station handles the entry of the material starting from the order notice. the order notice contains the carriers containing ordered articles. articles should be imported separately at the beginning of the usage of the software and updated with the introduction of new articles.

The carriers' table holds the information about the carriers and the articles they contain. It can be filtered by a search field. and sorted according to the different columns. Delivered carriers can be marked by printing their labels after then the print icon will turn green.

different materials can be imported from the right sidebar.

### Add article

To import a single article the add article button can be used. Needed information for each article are the article's number and its decription are required other information are optional.

- Article number: The article number is the unique identifier for each article (Qr-Code).
- Description: The description is a short description of the article.
- Package: The packaging is the number of the packaging of the article.
- Provider: The provider is the name of the provider of the article.
- Manufacturer: The manufacturer is the name of the manufacturer of the article.
- Sap number
- ...

[<img src="http://localhost:5000/assets/img/Add_Article.PNG" width="100%" class="center"/>](AddArticle)

### Import articles

Articles can also be imported from Excel / CSV files by using the import button. The import button will open a file explorer window. After selecting the file the user will be prompted to choose the columns of the files corresponding to the required information. after the articles are imported a dialog will be shown with the imported articles.

[<img src="http://localhost:5000/assets/img/Import_Articles.PNG" width="100%" class="center"/>](ImportArticles)

### Add carrier

When a new carrier is ordered it also must be added to the Software database. this can be done individually through the add carrier button. A new dialog prombting the user to fill in the required information will be shown. required information are the carrier's UID and the article this carrier is holding. information about the carrier's size and type are also required for right allocation in the storage devices.

- Carrier UID: The carrier UID is the unique identifier for each carrier (Qr-Code).
- Article: The article is the article the carrier is holding.
- Quantity: The quantity is the number of the components the carrier is holding.
- Type: type of the carrier.
- Width: The width of the reel carrier.
- Diameter: The diameter of the carrier.
- Lot number: The lot number of the carrier.

[<img src="http://localhost:5000/assets/img/Add_Carrier.PNG" width="100%" class="center"/>](AddCarrier)

### Import carriers

Carriers can also be imported from Excel / CSV files by using the import button. The import button will open a file explorer window. After selecting the file the user will be prompted to choose the columns of the files corresponding to the required information. after the carriers are imported a dialog will be shown with the imported carriers.

[<img src="http://localhost:5000/assets/img/Import_Carriers.PNG" width="100%" class="center"/>](ImportCarriers)

### Add feeder

To add feeders to the ATN SMT managment software the add feeder button can be used. The add feeder button will open a new dialog prompting the user to fill in the required information.

- Feeder UID : Will be used for the QR code of the feeder.
- Description : A description of the feeder.

[<img src="http://localhost:5000/assets/img/Import_Feeder.PNG" width="60%" class="center"/>](AddFeeder)

---

## Material storage

The material storage station allows the user to examine the material stored in different storages as well as Pick & Place machines. The material storage station content can be filtered by a search field. and sorted according to the different columns.

[<img src="http://localhost:5000/assets/img/MaterialStorage.gif" width="100%" class="center"/>](MaterialStorage)

ATN storage shelves can be interacted with from this page. through the rntries in the right sidebar the user can:

- Display a carrier: by choosing this entry and scanning the carrier's QR code, carrier's info will be displayed and its location will be dissplayed and indexed by the LED if it was stored in the smart shelf.
- Add carrier: by choosing this entry and scanning the carrier's QR code, the carrier will be allocated in the first available slot in the chosen storage device. This slot will be marked by a green blinking LED. Scanning another QR code will relocate the new carrier in the next free slot. The blinking LED will be turned off autmatically 5 seconds after the last QR code is scanned.
- Collect carrier: this entry serves two functions, first it will ad a carrier to the collection queue and mark its slot by blinking blue light by first scan of its QR code incase the carriers are collected according to a printed job order. Second it will confirm the collection of the carrier from the storage device by scanning the carrier's QR code turning its slot marker off.
- Delete carrier: this entry will delete a carrier from the storage device and archieve it in the database by scanning the carrier's QR code.
- Collect job: by choosing a job in this select box it's reserved material in the storage devices will be added to queue and thier slot markers will blink in blue, scanning each carrier's QR code will confirm its collection.

---

## Setup center

In this station the material usage in the production can be planned before the production starts. This is achieved through orgnising the usage through jobs each job contain information about the finished product, the material needed for the production, among other job attributes. these jobs and thier status can be examined through the jobs table. Green marked jobs are jobs that are planned to start within a day and therefore should be prepared. Yellow marked jobs are are jobs that should be on the machines. Red marked jobs are jobs that should be finished production.

[<img src="http://localhost:5000/assets/img/SetupCenter.PNG" width="100%" class="center"/>](SetupCenter)

These jobs can be created and managed through the tools in the right sidebar.

### Create job

In order to initiate a new a job the "Create job" button can be used. This will open a new dialog prompting the user to fill in the required information. these information are:

[<img src="http://localhost:5000/assets/img/CreateJob.PNG" width="90%" class="center"/>](CreateJob)

- Job name: The name of the job. (required)
- Job description: A description of the job. (required)
- Board: the name of the board producen in this job.
- Count: the number of boards to produce. (default 1)
- Customer: the name of the customer who ordered the job.
- Machine: the name of the machine that should be used for this job.
- Start date: the date the job should start.
- Finish date: the date the job should finish.
- Job Articles, for each article:
  - name of the article
  - the bank of the machine the article is placed on
  - the slot of the bank the article is placed on
  - the number of components needed from this artilce
    Alternativly, the job articles and thier attributes can be imported directly from "Inoplacer" job files by using the "import from file" button.
    the timeline offers a comprehensive overview of the jobs distribution on the machines to better plan jobs times.

[<img src="http://localhost:5000/assets/img/CreateJobTimeline.PNG" width="80%" class="center"/>](CJ_Timeline)

### Prepare material

After the job is created the material needed for this job's production can be preperaed and reserved before hand to be ready at the time of production. This can be done by clicking the "Prepare material" button. This will open a new dialog prompting the user to choose a carrier for each article.

the left side table will show the articles needed for the job and the right side table will show the carriers that are available for the chosen article. Upon clicking on each article the carriers table will be updated for the chosen article. When a carrier is selected the article will be checked. Articles and carriers already existing on the banks of the selected machine for this job will be indicated with a different color to notify operators they don't need to be prepared (Picked from storage and mounted on feeders).

[<img src="http://localhost:5000/assets/img/PrepareMaterial.gif" width="80%" class="center" />](PrepareMaterial)

The reserved material can be now collected from the storage using the job name in the "Material Storage" station.

### Disassemble machine

Before supplying the machine with the material for the next job, the material from the previous job must be disassembled first. the feeders on the machine could either contain an article that is used directly, and article that might be used later, an empty carrier or an article that wont be used soon and should be returned to storage.
The "Disassemble Machine" button will open a new dialog prompting the user to first select the machine to disassemble, then the QR-Code of the carrier of the feeder can be scanned to display the next planned usage of this carrier. this usage is displayed in a table showing the job name, start date, the bank and the slot number of the carrier's next reservations, sorted by the start date displaying the closest first. if no jobs are planned for this carrier a red notification will be displayed and is can be unmounted using the button next to the Scan input. Unmounting a carrier will both unmoount the feeder from the machine and the carrier from the feeder.

[<img src="http://localhost:5000/assets/img/DisassambleMachine.gif" width="80%" class="center" />](DisassambleMachine)

### Pre-Setup job

After the machine has been disassembled, the new material can be mounted on the machine, i.e. the carrier is mounted on the feeder and then on the machine. To do this, click on the "Pre-Setup Job" button. This will open a new dialog box asking the user to first select the pre-setup job. By scanning a carrier and then a feeder, the carrier is mounted on the feeder and its position on the machine can be identified using the table for correct mounting on the machine.

[<img src="http://localhost:5000/assets/img/PreSetup.gif" width="80%" class="center" />](PreSetup)

### Check setup

Before the job is started, the material sorting on the machine can be checked via the "Check Setup" button. After selecting the job to be checked and the bank, the feeders/carriers are scanned from the beginning to the end of the bank. Any error in sorting the feeders is indicated by visual and audible notifications. The slot number of each feeder is also displayed during scanning. However, whether or not the feeder is in the correct slot must be verified by the user.

### Finish job

Finally, the job can be marked as finished and the consumed material can be updated via the "Finish Job" button. A new dialog box will then open in which the user must first select the job to be terminated; the material consumed will be displayed in the table in this dialog box. The following figures are displayed for each carrier:
Target consumption: the calculated number of components that should have been used for this job.
Machine consumption: the number of components used that were retrieved from the machine.
Difference: the number of components that were lost during production and during installation and removal of the carriers.
Actual usage: the number of components finally selected (if machine is detected, machine usage + difference, if not, target usage + difference) is calculated and can be edited by the user.

---

## Admin

### Add user

---
