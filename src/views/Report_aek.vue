<template>
	<main>
		<h1>Test Report Journal Trust <i class="fa-regular fa-thumbs-up"></i></h1>
		
		<div style="text-align: right;">
			<!-- <button  @click="downloadData">
			<img :src="DownloadFile" alt="Download File" style="width: 40px; height: 40px;"/>
			</button> -->
			<button @click="downloadData" type="button" class="btn btn-dark btn-lg"><i class="fa-solid fa-download"></i> .xls</button>
        </div>
		<div style="margin-top: 10px;">
			<table id="example" class="table table-striped" style="width:100%">
				<thead>
				<tr>
				<th v-for="header in tableHeaders" :key="header" >{{ header }}</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index) in responseData_all" :key="index">
            		<td v-for="(value, key) in item" :key="key">{{ value }}</td>
        		</tr>	
				</tbody>
			</table>
		</div>
	</main>
</template>

<script>
import DownloadFile from '../assets/web.png'
import nextpage from '../assets/next.png'
import backpage from '../assets/back.png'
import * as XLSX from 'xlsx';
import $ from 'jquery';
import 'datatables.net';


export default {
	data() {
		return {
			responseData_check: null,
			responseData_all:  null,
			tableHeaders: null,
			currentPage: 1,
			itemsPerPage: 50,
			Year_Data:new Date().getFullYear(),
			Month_Data:new Date().getMonth()+1,
			Date_Data:new Date().getDate(),
			nextpage: nextpage,
			backpage: backpage,
			DownloadFile:DownloadFile,
		};
	},
	mounted() {
		this.getData_All().then(() => {
        $(this.$el).find('table').DataTable();
    });
	},
	methods: {
		async getData_All() {
			try {
				const response = await fetch('http://rpa-apiprd.inet.co.th:5000/RPA_get/DB?table_name=Log_Journal_Trust', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data_all = await response.json();
        		const columnNames = Object.keys(data_all[0]);
				this.responseData_all = data_all;
				console.log(data_all);
        		this.tableHeaders = columnNames;
				console.log(columnNames);
				this.responseData_check = data_all;
				
  
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		async downloadData() {
				if (!this.responseData_check || !this.responseData_all) return;

				const wb = XLSX.utils.book_new(); // สร้าง workbook ใหม่

				if (this.responseData_check.length > 0) {
					const ws = XLSX.utils.json_to_sheet(this.responseData_check);
					XLSX.utils.book_append_sheet(wb, ws, "Shee1");
				}


				// Generate XLSX file
				const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

				function s2ab(s) {
					const buf = new ArrayBuffer(s.length);
					const view = new Uint8Array(buf);
					for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
					return buf;
				}

				const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

				// Trigger download
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'Report_Journal_Trust_' + this.Date_Data + this.Month_Data + this.Year_Data + '.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
	},
	computed: {
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			const endIndex = startIndex + this.itemsPerPage;
			return this.responseData_check ? this.responseData_check.slice(startIndex, endIndex) : null;
		},
		totalPages() {
			return this.responseData_check ? Math.ceil(this.responseData_check.length / this.itemsPerPage) : 0;
		}
	},
};
</script>

<style>
@import url('https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.min.css');
@import url('https://cdn.datatables.net/2.0.3/css/dataTables.bootstrap5.css');


#about-page {
	margin: 0 auto;
	max-width: auto;
}
.download-button {
		top: 5%;
		right: 3%;
		position: fixed;
        float: right; /* Float the button to the right */
        margin-right: 10px; /* Add some margin for spacing */
    }
</style>
