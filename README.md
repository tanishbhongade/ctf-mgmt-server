# CTF Management Server

## Description
A CTF management server which is built for orchestrating a distributed CTF.
<br>

This is a central control server which is responsible for handling:
<br>

- Player registration and login
- Managing player state
- Container deployment with working in coordination with worker nodes

## Running the server
```bash
npm i
node server.js
```

## Configuration

There are two configuration files in this system which you have to configure:
<br>

- config.env <br>
  This is the file where all your secrets live; for e.g. database ports, encryption keys. So make sure to configure it properly and ensure to not leak its contents
  <br>

- workernodes.json <br>
  This is the file where all your worker node configuration will live; for e.g. IP address of worker nodes and port on which the worker node is listening to create/delete containers

## API Endpoints

### POST `/api/user/register`

### Description:

Registers a new player and creates a container for them.

### Request Body:

```json
{
  "playerId": "yourPlayerId",
  "playerPassword": "yourSecurePassword"
}
```

### POST `/api/user/login`

### Description:

Authenticates an existing player using `playerId` and `playerPassword`.  
Returns a success message and sets a secure JWT in a cookie for future requests.

### Request Body:

```json
{
  "playerId": "wargamer123",
  "playerPassword": "SuperSecretPass"
}
```

### POST `/api/player/submitflag`

### Description:

Checks whether the flag submitted by the player is correct or not according to the level the player is playing in

### Request Body:

```json
{
  "flag": "flag{JUSTANOTHERRANDOMFLAG}"
}
```

### PATCH `/api/player/resetlevel`

### Description:

Lets the user to reset the level, if something goes wrong.

### Request Body:

```json
{
  
}
```
