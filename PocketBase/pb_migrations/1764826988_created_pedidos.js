/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.rol = \"admin\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation577089629",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "usuario",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json1987350758",
        "maxSize": 0,
        "name": "productos",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "number3257917790",
        "max": null,
        "min": 0,
        "name": "total",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "select643686883",
        "maxSelect": 1,
        "name": "estado",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "pendiente",
          "entregado",
          "procesado",
          "enviado",
          "cancelado"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3365537321",
        "max": 0,
        "min": 0,
        "name": "direccion_envio",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2316208232",
        "max": 0,
        "min": 0,
        "name": "metodo_pago",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1702323080",
        "max": 0,
        "min": 0,
        "name": "notas",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_4131763008",
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && (usuario = @request.auth.id || @request.auth.rol = \"admin\")",
    "name": "pedidos",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.rol = \"admin\"",
    "viewRule": "@request.auth.id != \"\" && (usuario = @request.auth.id || @request.auth.rol = \"admin\")"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4131763008");

  return app.delete(collection);
})
