package electronics.elecstore.services;

import electronics.elecstore.models.CartsModel;
import electronics.elecstore.repositories.CartsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartsServiceTest {

    @Mock
    private CartsRepository cartsRepository;

    @InjectMocks
    private CartsService cartsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addCart() {
        CartsModel cart = new CartsModel(1L);
        when(cartsRepository.save(cart)).thenReturn(cart);

        CartsModel savedCart = cartsService.addCart(cart);

        assertNotNull(savedCart);
        assertEquals(1L, savedCart.getUserId());
        verify(cartsRepository, times(1)).save(cart);
    }

    @Test
    void getAllCarts() {
        List<CartsModel> carts = Arrays.asList(new CartsModel(1L), new CartsModel(2L));
        when(cartsRepository.findAll()).thenReturn(carts);

        List<CartsModel> result = cartsService.getAllCarts();

        assertEquals(2, result.size());
        verify(cartsRepository, times(1)).findAll();
    }

    @Test
    void getCartById() {
        CartsModel cart = new CartsModel(1L);
        when(cartsRepository.findById(1L)).thenReturn(Optional.of(cart));

        Optional<CartsModel> result = cartsService.getCartById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getUserId());
        verify(cartsRepository, times(1)).findById(1L);
    }

    @Test
    void deleteCart() {
        doNothing().when(cartsRepository).deleteById(1L);

        cartsService.deleteCart(1L);

        verify(cartsRepository, times(1)).deleteById(1L);
    }
}
