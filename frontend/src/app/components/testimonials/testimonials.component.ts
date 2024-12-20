import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../models/testimonial.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-testimonials',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonials: any[] = [];
  testimonialForm: FormGroup;
  selectedFile: File | null = null;
  isAdmin = true; // Change based on user role logic

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private toastr: ToastrService
  ) {
    this.testimonialForm = this.fb.group({
      username: ['', Validators.required],
      comment: ['', Validators.required],
      stars: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.loadTestimonials();
    console.log(this.testimonials);
  }

  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe((data) => {
      this.testimonials = data;
      //window.location.reload();
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submitTestimonial(): void {
    if (this.testimonialForm.invalid) {
      return;
    }
  
    const testimonialData: Testimonial = {
    
      username: this.testimonialForm.value.username,
      comment: this.testimonialForm.value.comment,
      stars: this.testimonialForm.value.stars,
      photo: this.selectedFile?.name || '' // Send only the filename
    };
  
    this.testimonialService.addTestimonial(testimonialData).subscribe(
      () => {
        this.toastr.success('Testimonial added successfully!');
        this.testimonialForm.reset();
        this.loadTestimonials();
      },
      (error) => {
        this.toastr.error('Failed to add testimonial');
        console.error(error);
      }
    );
  }
  

  deleteTestimonial(id: number): void {
    this.testimonialService.deleteTestimonial(id).subscribe(
      () => {
        this.toastr.success('Testimonial deleted successfully!');
        this.loadTestimonials();
      },
      (error) => {
        this.toastr.error('Failed to delete testimonial');
        console.error(error);
      }
    );
  }
}
