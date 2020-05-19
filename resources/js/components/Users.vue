<template>
    <div class="container">
        <div class="row pt-5">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users List</h3>

                <div class="card-tools">
                    <button class="btn btn-success text-white" @click="newModal">
                      <i class="fa fa-user-plus"></i> Add new
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created @</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{user.id}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.created_at|myDate}}</td>
                        <td>
                            <a href="#" @click="editModal(user)" class="btn btn-sm btn-info text-white">
                                <i class="fa fa-edit"></i>
                            </a>
                            -
                            <a href="#" @click="deleteUser(user.id)" class="btn btn-sm btn-danger">
                                <i class="fa fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-if="editMode" class="modal-title" id="addNewLongTitle">Edit user</h5>
                        <h5 v-else class="modal-title" id="addNewLongTitle">New user</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? editUser() : addUser()" @keydown="form.onKeydown($event)">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" v-model="form.name" 
                                        class="form-control" id="Name" 
                                        placeholder="Enter a name" :class="{ 'is-invalid': form.errors.has('name') }">
                                        <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="email">Email address</label>
                                <input type="email" v-model="form.email" 
                                        class="form-control" id="email" 
                                        placeholder="Enter email" :class="{ 'is-invalid': form.errors.has('email') }">
                                        <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" v-model="form.password" 
                                        class="form-control" id="password" 
                                        placeholder="Password" :class="{ 'is-invalid': form.errors.has('password') }">
                                        <has-error :form="form" field="password"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button v-if="editMode" type="submit" class="btn btn-primary">Update changes</button>
                            <button v-else type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode : false,
                users : [],
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                })
            }
        }, 
        methods: {
            getUsers() {
                this.$Progress.start()
                axios.get("api/users").then(res => (this.users = res.data.data));
                this.$Progress.finish()
            },
            addUser () {
                this.$Progress.start()
                // Submit the form via a POST request
                this.form.post('/api/user')
                .then(()=> {
                    Fire.$emit('refreshUsers')
                    $('#addNew').modal('hide')
                    Toast.fire({
                        icon: 'success',
                        title: 'New user added'
                    })
                    this.$Progress.finish()
                })
                .catch((error)=> {
                    Toast.fire({
                        icon: 'error',
                        title: 'Adding user failed !'
                    })
                    this.$Progress.fail()
                    
                })
                
            },
            editUser() {
                this.$Progress.start()
                // Submit the form via a PUT request
                this.form.put('/api/user/'+this.form.id)
                .then(()=> {
                    Fire.$emit('refreshUsers')
                    $('#addNew').modal('hide')
                    Toast.fire({
                        icon: 'success',
                        title: 'User updated'
                    })
                    this.$Progress.finish()
                })
                .catch((error) => {
                    Toast.fire({
                        icon: 'error',
                        title: 'Update failed !'
                    })
                    this.$Progress.fail()
                })
            },
            deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        this.$Progress.start()
                        //Http request to delete the user with $id
                        this.form.delete('/api/user/'+id)
                        .then(()=>{
                            Swal.fire(
                                'Deleted!',
                                'User has been deleted.',
                                'success'
                            )
                            Fire.$emit('refreshUsers')
                            this.$Progress.finish()
                        }).catch(()=>{
                            Swal.fire(
                                'Error!',
                                'User deleting failed',
                                'error'
                            )
                            this.$Progress.fail()
                        })   
                    }
                })
            },
            newModal() {
                this.form.reset();
                this.editMode = false;
                $('#addNew').modal('show')
            },
            editModal(user) {
                this.form.reset();
                this.form.clear();
                this.editMode = true;
                $('#addNew').modal('show')
                this.form.fill(user)
            }
        },
        created() {
            this.getUsers();
            Fire.$on('refreshUsers', () => this.getUsers())
        }
    }
</script>

<style scoped>

</style>