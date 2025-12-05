/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4131763008")

  // update collection data
  unmarshal({
    "listRule": "usuario = @request.auth.id || @request.auth.rol = \"admin\"",
    "viewRule": "usuario = @request.auth.id || @request.auth.rol = \"admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4131763008")

  // update collection data
  unmarshal({
    "listRule": "usuario = @request.auth.id",
    "viewRule": "usuario = @request.auth.id"
  }, collection)

  return app.save(collection)
})
