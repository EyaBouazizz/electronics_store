package electronics.elecstore.controllers;

import electronics.elecstore.models.CartsModel;
import electronics.elecstore.services.CartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartsController {

    @Autowired
    private CartsService cartsService;

    @PostMapping
    public ResponseEntity<CartsModel> addCart(@RequestBody CartsModel cart) {
        return ResponseEntity.ok(cartsService.addCart(cart));
    }

    @GetMapping
    public ResponseEntity<List<CartsModel>> getAllCarts() {
        return ResponseEntity.ok(cartsService.getAllCarts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartsModel> getCartById(@PathVariable Long id) {
        return cartsService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartsService.deleteCart(id);
        return ResponseEntity.noContent().build();
    }
}
