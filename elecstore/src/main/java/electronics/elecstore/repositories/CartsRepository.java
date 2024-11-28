package electronics.elecstore.repositories;

import electronics.elecstore.models.CartsModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartsRepository extends JpaRepository<CartsModel, Long> {
}
