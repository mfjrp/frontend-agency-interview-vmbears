import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { FileService } from './file.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-agency';
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };

  constructor(private fileService: FileService) {}

  // define a function to upload a files
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for( const file of files ) {
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
  
  private reportProgress(httpEvent: HttpEvent<string[]>) {
    switch(httpEvent.type) {
      case HttpEventType.UploadProgress: 
        this.upddateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
      case HttpEventType.ResponseHeader: 
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response: 
        if( httpEvent.body instanceof Array ) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        }
        this.fileStatus.status = 'done';
        break;
        default:
          console.log(httpEvent);
          break;
    }
  }
  
  private upddateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
}
