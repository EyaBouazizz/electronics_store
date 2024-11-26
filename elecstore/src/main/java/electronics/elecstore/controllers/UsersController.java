package electronics.elecstore.controllers;

import electronics.elecstore.models.UsersModel;
import electronics.elecstore.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping
    public List<UsersModel> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsersModel> getUserById(@PathVariable Integer id) {
        return usersService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsersModel createUser(@RequestBody UsersModel user) {
        return usersService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsersModel> updateUser(@PathVariable Integer id, @RequestBody UsersModel userDetails) {
        try {
            UsersModel updatedUser = usersService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
