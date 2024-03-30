<template>
	<main>
		<h1>Test Report Journal Trust</h1>
    <input type="text" v-model="searchTerm" placeholder="Search">
		<div style="text-align: right;">
			<button class="download-button" @click="downloadData">
			<img :src="DownloadFile" alt="Download File" style="width: 40px; height: 40px;"/>
			</button>
        </div>
		<div style="margin-top: 10px;">
			<table id="example" class="table table-striped" style="width:100%">
				<thead>
					<tr>
						<th v-for="header in tableHeaders" :key="header" >{{ header }}</th>
					</tr>
				</thead>
				<tbody v-if="paginatedData" >
					<tr v-for="(item, index) in paginatedData" :key="index">
						<td v-for="(value, key) in item" :key="key" >{{ value }}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td style="text-align: center;" :colspan="tableHeaders.length">Loading...</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="pagination" style="font-size: 12px;">
			<button @click="previousPage" :disabled="currentPage === 1"><img :src="backpage" alt="back page" style="width: 25px; height: 25px;"/></button>
			<span>Page : </span>
			<input type="number" v-model.number="currentPage" min="1" :max="totalPages" class="page-input">
			<span>of {{ totalPages }}</span>
			<button @click="nextPage" :disabled="currentPage === totalPages"><img :src="nextpage" alt="next page" style="width: 25px; height: 25px;"/></button>
		</div>
    
    <div class="overflow-auto">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>

    <p class="mt-3">Current Page: {{ currentPage }}</p>

    <b-table
      id="my-table"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      small
    ></b-table>
  </div>
	</main>
</template>

<script>
import DownloadFile from '../assets/web.png'
import nextpage from '../assets/next.png'
import backpage from '../assets/back.png'
import * as XLSX from 'xlsx';


export default {
	data() {
		return {
			responseData_check: null,
			responseData_all: null,
			currentPage: 1,
			itemsPerPage: 50,
			tableHeaders: [],
			Year_Data:new Date().getFullYear(),
			Month_Data:new Date().getMonth()+1,
			Date_Data:new Date().getDate(),
			nextpage: nextpage,
			backpage: backpage,
			DownloadFile:DownloadFile
		};
	},
	mounted() {
		this.getData_Check();
		this.getData_All();
    
		
	},
	methods: {
		async getData_Check() {
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
				const data_check = await response.json();
				this.responseData_check = data_check;
        const columnNames = Object.keys(data_check[0]); // ชื่อคอลัมน์อยู่ในอาร์เรย์แรกของข้อมูล
        this.tableHeaders = columnNames;
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},async getData_All() {
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
        const columnNames = Object.keys(data_all[0]); // ชื่อคอลัมน์อยู่ในอาร์เรย์แรกของข้อมูล
        this.tableHeaders = columnNames;
				this.responseData_all = data_all;
  
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		async previousPage() {
			if (this.currentPage > 1) {
				this.currentPage--;
			}
		},
		async nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++;
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
				link.download = 'Report_Statement_' + this.Date_Data + this.Month_Data + this.Year_Data + '.xlsx';
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
	}
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css');
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

.pagination {
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pagination button {
	margin: 0 5px;
}
.page-input {
	margin: 5px;
	width: 50px;
	text-align: center;
}
</style>
