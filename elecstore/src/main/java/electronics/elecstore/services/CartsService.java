package electronics.elecstore.services;

import electronics.elecstore.models.CartsModel;
import electronics.elecstore.repositories.CartsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartsService {

    @Autowired
    private CartsRepository cartsRepository;

    public CartsModel addCart(CartsModel cart) {
        return cartsRepository.save(cart);
    }

    public List<CartsModel> getAllCarts() {
        return cartsRepository.findAll();
    }

    public Optional<CartsModel> getCartById(Long id) {
        return cartsRepository.findById(id);
    }

    public void deleteCart(Long id) {
        cartsRepository.deleteById(id);
    }
}
