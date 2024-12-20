package electronics.elecstore.controllers;

import electronics.elecstore.models.TestimonialsModel;
import electronics.elecstore.services.TestimonialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "http://localhost:4200")
public class TestimonialsController {

    @Autowired
    private TestimonialsService testimonialsService;

    @CrossOrigin
    @GetMapping
    public List<TestimonialsModel> getAllTestimonials() {
        return testimonialsService.getAllTestimonials();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestimonialsModel> getTestimonialById(@PathVariable Integer id) {
        return testimonialsService.getTestimonialById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TestimonialsModel createTestimonial(@RequestBody TestimonialsModel testimonial) {
        return testimonialsService.createTestimonial(testimonial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestimonialsModel> updateTestimonial(@PathVariable Integer id, @RequestBody TestimonialsModel testimonialDetails) {
        try {
            TestimonialsModel updatedTestimonial = testimonialsService.updateTestimonial(id, testimonialDetails);
            return ResponseEntity.ok(updatedTestimonial);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Integer id) {
        testimonialsService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}
