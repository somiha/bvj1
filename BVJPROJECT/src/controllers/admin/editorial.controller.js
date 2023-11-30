const { readData, createUpdateDelete } = require("../../helper/PromiseModule");

const renderAddEditorial = async (req, res) => {
  const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
  var data = await readData(volumes_query);
  res.render('admin-panel/editorial/add', {
    title: "Add Editorial",
    path: "/add_editorial",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    volumes: data,
    isError: false,
    msg: '',
    editPath: 'add'
  })
}

const doAddEditorial = async (req, res) => {
  try { 
    const dbObj = {
      ...req.body,
      file_url: req.file.filename
    }
    
    const inser_query = `INSERT INTO editorials SET ?`;
    createUpdateDelete(inser_query, dbObj);
    const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
    var data = await readData(volumes_query);

    res.render('admin-panel/editorial/add', {
      title: "Add Editorial",
      path: "/add_editorial",
      editPath: "add",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volumes: data, 
      isError: false,
      msg: "Editorial Added Successfully!"
    })
  } catch(error) { 
    console.log(error)
  }
}

const renderViewEditorial = async (req, res) => {
  const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
  var data = await readData(volumes_query);
  res.render('admin-panel/editorial/view', {
    title: "Editorials",
    path: "/editorials",
    isLogged: req.isLogged,
    isAdmin: req.isAdmin,
    volumes: data,
    isError: false,
    msg: '',
    editPath: 'view'
  })
}

const renderViewEditorialById = async (req, res) => {
  try { 
    const editorial_id = req.params.editorial_id;
    const editorial_query = `SELECT volumes.id as id, editorials.title as title, description, file_url, volumes.title as volume_title, volumes.id as volume_id FROM editorials INNER JOIN volumes ON editorials.volume = volumes.id WHERE editorials.id = '${editorial_id}'`;
    var editorial = await readData(editorial_query);
    console.log(editorial)
    if(!editorial[0]){
      res.redirect('/admin_panel/editorial/view?msg=Editorial Not Found!');
      return;
    }
    const volumes_query = `SELECT id, title FROM volumes ORDER BY position ASC`;
    var data = await readData(volumes_query);
    res.render('admin-panel/editorial/view-by-editorial-id', {
      title: "Editorials",
      path: "/editorials",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volume: data,
      isError: false,
      msg: '',
      editPath: 'view',
      editorial: editorial[0] ? editorial[0] : {}
    })
  } catch(error) { 
    console.log(error)
  }
}

const renderEditorialsByVolId = async (req, res) => {
  try { 
    const { volume_id } = req.params;
    const volumes_query = `SELECT id, title FROM volumes WHERE id = ${volume_id}`;
    var data = await readData(volumes_query);
    const editorials_query = `SELECT * FROM editorials WHERE volume = ${volume_id}`;
    var editorials = await readData(editorials_query);

    res.render('admin-panel/editorial/view-by-vol-id', {
      title: "Editorials",
      path: "/editorials",
      isLogged: req.isLogged,
      isAdmin: req.isAdmin,
      volume: data[0].title,
      editorials,
      isError: false,
      msg: '',
      editPath: 'view'
    })
  } catch(error) { 
    console.log(error)
  }
}

const deleteEditorialById = async (req, res) => {
  try { 
    const { return_vol } = req.query;
    const { editorial_id } = req.params;
    const delete_query = `DELETE FROM editorials WHERE id = ${editorial_id}`;
    createUpdateDelete(delete_query);
    res.redirect('/admin_panel/editorial/view/' + return_vol + '?msg=Editorial Deleted Successfully!');
  } catch(error) { 
    console.log(error)
  }
}

module.exports = {
  renderAddEditorial,
  doAddEditorial,
  renderViewEditorialById,
  renderViewEditorial,
  renderEditorialsByVolId,
  deleteEditorialById
}